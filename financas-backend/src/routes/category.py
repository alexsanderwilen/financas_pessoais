from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import db
from src.models.category import Category

category_bp = Blueprint('category', __name__)

@category_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Lista categorias do usuário autenticado + categorias padrão"""
    try:
        user_id = get_jwt_identity()
        
        # Buscar categorias do usuário + categorias padrão
        categories = Category.query.filter(
            (Category.user_id == user_id) | (Category.is_default == True)
        ).all()
        
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """Cria uma nova categoria para o usuário autenticado"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'name' not in data or 'type' not in data:
            return jsonify({'error': 'Nome e tipo são obrigatórios'}), 400
        
        # Verificar se já existe categoria com mesmo nome para o usuário
        existing = Category.query.filter(
            Category.name == data['name'],
            Category.user_id == user_id
        ).first()
        
        if existing:
            return jsonify({'error': 'Categoria já existe'}), 400
        
        category = Category(
            name=data['name'],
            type=data['type'],
            user_id=user_id,
            is_default=False
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    """Atualiza uma categoria do usuário autenticado"""
    try:
        user_id = get_jwt_identity()
        category = Category.query.filter(
            Category.id == category_id,
            Category.user_id == user_id
        ).first()
        
        if not category:
            return jsonify({'error': 'Categoria não encontrada'}), 404
        
        # Não permitir edição de categorias padrão
        if category.is_default:
            return jsonify({'error': 'Não é possível editar categorias padrão'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        if 'name' in data:
            # Verificar se já existe categoria com mesmo nome
            existing = Category.query.filter(
                Category.name == data['name'],
                Category.user_id == user_id,
                Category.id != category_id
            ).first()
            
            if existing:
                return jsonify({'error': 'Categoria já existe'}), 400
            
            category.name = data['name']
        
        if 'type' in data:
            category.type = data['type']
        
        db.session.commit()
        return jsonify(category.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    """Remove uma categoria do usuário autenticado"""
    try:
        user_id = get_jwt_identity()
        category = Category.query.filter(
            Category.id == category_id,
            Category.user_id == user_id
        ).first()
        
        if not category:
            return jsonify({'error': 'Categoria não encontrada'}), 404
        
        # Não permitir exclusão de categorias padrão
        if category.is_default:
            return jsonify({'error': 'Não é possível excluir categorias padrão'}), 403
        
        # Verificar se há transações usando esta categoria
        if category.transactions:
            return jsonify({'error': 'Não é possível excluir categoria com transações associadas'}), 400
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({'message': 'Categoria removida com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

