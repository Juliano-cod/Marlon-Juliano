import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Idea, IdeaStatus } from '../types';

interface DashboardPageProps {
  ideas: Idea[];
}

const COLORS = {
  [IdeaStatus.New]: '#3B82F6', // Blue
  [IdeaStatus.InProgress]: '#F59E0B', // Amber
  [IdeaStatus.Completed]: '#10B981', // Emerald
};

export default function DashboardPage({ ideas }: DashboardPageProps) {
  const statusCounts = ideas.reduce((acc, idea) => {
    acc[idea.status] = (acc[idea.status] || 0) + 1;
    return acc;
  }, {} as Record<IdeaStatus, number>);

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Dashboard de Ideias</h1>
        <p className="text-gray-500 mt-2">Uma visão geral do progresso das suas ideias.</p>
      </header>
      <main>
        {ideas.length === 0 ? (
           <div className="text-center py-10 px-6 bg-white rounded-xl shadow-md">
             <p className="text-gray-500">Nenhuma ideia para exibir. Comece adicionando algumas na página inicial!</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Quantidade de Ideias">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as IdeaStatus]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}