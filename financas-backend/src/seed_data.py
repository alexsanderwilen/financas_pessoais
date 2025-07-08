import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db
from src.models.category import Category
from src.main import app

def seed_default_categories():
    """Popula o banco com categorias padrão do sistema"""
    
    # Categorias de receita
    receita_categories = [
        'Salário',
        'Freelance', 
        'Investimentos',
        'Vendas',
        'Outros Rendimentos'
    ]
    
    # Categorias de despesa
    despesa_categories = [
        'Alimentação',
        'Transporte',
        'Moradia',
        'Saúde',
        'Educação',
        'Lazer',
        'Roupas',
        'Tecnologia',
        'Serviços',
        'Outros Gastos'
    ]
    
    # Categorias gerais
    geral_categories = [
        'Transferência',
        'Ajuste'
    ]
    
    with app.app_context():
        # Verificar se já existem categorias padrão
        existing_defaults = Category.query.filter(Category.is_default == True).count()
        
        if existing_defaults > 0:
            print(f"Já existem {existing_defaults} categorias padrão no banco.")
            return
        
        # Criar categorias de receita
        for name in receita_categories:
            category = Category(
                name=name,
                type='receita',
                user_id=None,
                is_default=True
            )
            db.session.add(category)
        
        # Criar categorias de despesa
        for name in despesa_categories:
            category = Category(
                name=name,
                type='despesa',
                user_id=None,
                is_default=True
            )
            db.session.add(category)
        
        # Criar categorias gerais
        for name in geral_categories:
            category = Category(
                name=name,
                type='geral',
                user_id=None,
                is_default=True
            )
            db.session.add(category)
        
        try:
            db.session.commit()
            print(f"Criadas {len(receita_categories) + len(despesa_categories) + len(geral_categories)} categorias padrão com sucesso!")
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao criar categorias padrão: {e}")

if __name__ == '__main__':
    seed_default_categories()

