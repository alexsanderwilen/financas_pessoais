import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFinance } from '../contexts/FinanceContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const TransactionForm = ({ transaction, onSuccess, onCancel }) => {
  const { categories, createTransaction, updateTransaction, loading, error } = useFinance();
  const [formData, setFormData] = useState({
    type: transaction?.type || 'despesa',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    category_id: transaction?.category_id || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
  });
  const [success, setSuccess] = useState(false);

  const isEditing = !!transaction;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      if (isEditing) {
        await updateTransaction(transaction.id, formData);
      } else {
        await createTransaction(formData);
      }
      
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      } else if (!isEditing) {
        // Limpar formulário apenas se não estiver editando
        setFormData({
          type: 'despesa',
          amount: '',
          description: '',
          category_id: '',
          date: new Date().toISOString().split('T')[0],
        });
      }

      // Remover mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Filtrar categorias baseado no tipo selecionado
  const filteredCategories = categories.filter(
    category => category.type === formData.type || category.type === 'geral'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Transação {isEditing ? 'atualizada' : 'criada'} com sucesso!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descreva a transação..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category_id?.toString() || ''}
            onValueChange={(value) => handleChange('category_id', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar Transação'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;

