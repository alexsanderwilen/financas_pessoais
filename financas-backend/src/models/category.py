from src.models.user import db

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'receita', 'despesa', 'geral'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Nullable para categorias padrão
    is_default = db.Column(db.Boolean, default=False)  # Categorias padrão do sistema
    
    # Relacionamento com transações
    transactions = db.relationship('Transaction', backref='category', lazy=True)

    def __repr__(self):
        return f'<Category {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'user_id': self.user_id,
            'is_default': self.is_default
        }

