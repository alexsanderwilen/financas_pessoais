import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';

const BalanceDisplay = () => {
  const { balance, loading } = useFinance();

  if (
    loading ||
    !balance ||
    !balance.mensal ||
    !balance.anual ||
    !balance.periodo
  ) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getBalanceColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceIcon = (value) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <DollarSign className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(balance.mensal.receitas)}
          </div>
          <p className="text-xs text-muted-foreground">
            {balance.periodo.mes}/{balance.periodo.ano}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(balance.mensal.despesas)}
          </div>
          <p className="text-xs text-muted-foreground">
            {balance.periodo.mes}/{balance.periodo.ano}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo do Mês</CardTitle>
          {getBalanceIcon(balance.mensal.saldo)}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getBalanceColor(balance.mensal.saldo)}`}>
            {formatCurrency(balance.mensal.saldo)}
          </div>
          <p className="text-xs text-muted-foreground">
            {balance.periodo.mes}/{balance.periodo.ano}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Resumo Anual {balance.periodo.ano}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Receitas Anuais</div>
              <div className="text-xl font-semibold text-green-600">
                {formatCurrency(balance.anual.receitas)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Despesas Anuais</div>
              <div className="text-xl font-semibold text-red-600">
                {formatCurrency(balance.anual.despesas)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Saldo Anual</div>
              <div className={`text-xl font-semibold ${getBalanceColor(balance.anual.saldo)}`}>
                {formatCurrency(balance.anual.saldo)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceDisplay;

