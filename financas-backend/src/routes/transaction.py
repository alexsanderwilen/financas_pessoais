from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import db
from src.models.transaction import Transaction
from src.models.category import Category
from datetime import datetime
from sqlalchemy import extract, func

transaction_bp = Blueprint('transaction', __name__)

@transaction_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Lista transações do usuário autenticado com filtros opcionais"""
    try:
        user_id = get_jwt_identity()
        
        # Construir query base
        query = Transaction.query.filter(Transaction.user_id == user_id)
        
        # Aplicar filtros
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        transaction_type = request.args.get('type')
        category_id = request.args.get('category_id', type=int)
        
        if month:
            query = query.filter(extract('month', Transaction.date) == month)
        if year:
            query = query.filter(extract('year', Transaction.date) == year)
        if transaction_type:
            query = query.filter(Transaction.type == transaction_type)
        if category_id:
            query = query.filter(Transaction.category_id == category_id)
        
        # Ordenar por data (mais recente primeiro)
        transactions = query.order_by(Transaction.date.desc()).all()
        
        return jsonify([transaction.to_dict() for transaction in transactions]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transaction_bp.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    """Cria uma nova transação para o usuário autenticado"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Validar campos obrigatórios
        required_fields = ['date', 'type', 'amount', 'description', 'category_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se a categoria pertence ao usuário ou é padrão
        category = Category.query.filter(
            Category.id == data['category_id'],
            (Category.user_id == user_id) | (Category.is_default == True)
        ).first()
        
        if not category:
            return jsonify({'error': 'Categoria não encontrada'}), 404
        
        # Converter data
        try:
            date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        transaction = Transaction(
            date=date,
            type=data['type'],
            amount=float(data['amount']),
            description=data['description'],
            category_id=data['category_id'],
            user_id=user_id
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify(transaction.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@transaction_bp.route('/transactions/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    """Atualiza uma transação do usuário autenticado"""
    try:
        user_id = get_jwt_identity()
        transaction = Transaction.query.filter(
            Transaction.id == transaction_id,
            Transaction.user_id == user_id
        ).first()
        
        if not transaction:
            return jsonify({'error': 'Transação não encontrada'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Atualizar campos se fornecidos
        if 'date' in data:
            try:
                transaction.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        if 'type' in data:
            transaction.type = data['type']
        
        if 'amount' in data:
            transaction.amount = float(data['amount'])
        
        if 'description' in data:
            transaction.description = data['description']
        
        if 'category_id' in data:
            # Verificar se a categoria pertence ao usuário ou é padrão
            category = Category.query.filter(
                Category.id == data['category_id'],
                (Category.user_id == user_id) | (Category.is_default == True)
            ).first()
            
            if not category:
                return jsonify({'error': 'Categoria não encontrada'}), 404
            
            transaction.category_id = data['category_id']
        
        db.session.commit()
        return jsonify(transaction.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@transaction_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    """Remove uma transação do usuário autenticado"""
    try:
        user_id = get_jwt_identity()
        transaction = Transaction.query.filter(
            Transaction.id == transaction_id,
            Transaction.user_id == user_id
        ).first()
        
        if not transaction:
            return jsonify({'error': 'Transação não encontrada'}), 404
        
        db.session.delete(transaction)
        db.session.commit()
        
        return jsonify({'message': 'Transação removida com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@transaction_bp.route('/balance', methods=['GET'])
@jwt_required()
def get_balance():
    """Calcula saldos do usuário autenticado"""
    try:
        user_id = get_jwt_identity()
        
        # Obter filtros
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        
        # Query base
        query = Transaction.query.filter(Transaction.user_id == user_id)
        
        # Aplicar filtros de período
        if month:
            query = query.filter(extract('month', Transaction.date) == month)
        if year:
            query = query.filter(extract('year', Transaction.date) == year)
        
        # Calcular receitas e despesas
        receitas = query.filter(Transaction.type == 'receita').with_entities(
            func.sum(Transaction.amount)
        ).scalar() or 0
        
        despesas = query.filter(Transaction.type == 'despesa').with_entities(
            func.sum(Transaction.amount)
        ).scalar() or 0
        
        saldo = receitas - despesas
        
        # Se não há filtros específicos, calcular também totais anuais
        result = {
            'receitas': receitas,
            'despesas': despesas,
            'saldo': saldo
        }
        
        # Calcular totais anuais se não há filtro de ano ou se há apenas filtro de ano
        if not year or (year and not month):
            current_year = year or datetime.now().year
            
            annual_query = Transaction.query.filter(
                Transaction.user_id == user_id,
                extract('year', Transaction.date) == current_year
            )
            
            receitas_anuais = annual_query.filter(Transaction.type == 'receita').with_entities(
                func.sum(Transaction.amount)
            ).scalar() or 0
            
            despesas_anuais = annual_query.filter(Transaction.type == 'despesa').with_entities(
                func.sum(Transaction.amount)
            ).scalar() or 0
            
            result['receitas_anuais'] = receitas_anuais
            result['despesas_anuais'] = despesas_anuais
            result['saldo_anual'] = receitas_anuais - despesas_anuais
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transaction_bp.route('/reports/expenses-by-category', methods=['GET'])
@jwt_required()
def get_expenses_by_category():
    """Relatório de despesas por categoria"""
    try:
        user_id = get_jwt_identity()
        
        # Obter filtros
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        
        # Query base para despesas
        query = db.session.query(
            Category.name,
            func.sum(Transaction.amount).label('total')
        ).join(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'despesa'
        )
        
        # Aplicar filtros de período
        if month:
            query = query.filter(extract('month', Transaction.date) == month)
        if year:
            query = query.filter(extract('year', Transaction.date) == year)
        
        # Agrupar por categoria
        results = query.group_by(Category.name).all()
        
        data = [{'category': name, 'amount': float(total)} for name, total in results]
        
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transaction_bp.route('/reports/monthly-summary', methods=['GET'])
@jwt_required()
def get_monthly_summary():
    """Relatório de resumo mensal"""
    try:
        user_id = get_jwt_identity()
        year = request.args.get('year', type=int, default=datetime.now().year)
        
        # Query para dados mensais
        monthly_data = db.session.query(
            extract('month', Transaction.date).label('month'),
            Transaction.type,
            func.sum(Transaction.amount).label('total')
        ).filter(
            Transaction.user_id == user_id,
            extract('year', Transaction.date) == year
        ).group_by(
            extract('month', Transaction.date),
            Transaction.type
        ).all()
        
        # Organizar dados por mês
        months_data = {}
        for month, transaction_type, total in monthly_data:
            month_key = int(month)
            if month_key not in months_data:
                months_data[month_key] = {'receitas': 0, 'despesas': 0}
            months_data[month_key][transaction_type + 's'] = float(total)
        
        # Converter para lista ordenada
        result = []
        for month in range(1, 13):
            data = months_data.get(month, {'receitas': 0, 'despesas': 0})
            result.append({
                'month': month,
                'receitas': data['receitas'],
                'despesas': data['despesas'],
                'saldo': data['receitas'] - data['despesas']
            })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

