import { useState } from 'react';
import { Idea, IdeaStatus, Priority } from '../types';

interface HomePageProps {
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
}

export default function HomePage({ ideas, setIdeas }: HomePageProps) {
  const [newIdeaText, setNewIdeaText] = useState('');
  const [newIdeaPriority, setNewIdeaPriority] = useState<Priority>(Priority.Medium);
  const [expandedIdeaId, setExpandedIdeaId] = useState<number | null>(null);

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdeaText.trim() === '') return;

    const newIdeaData = {
      text: newIdeaText,
      status: IdeaStatus.New,
      priority: newIdeaPriority,
      commits: [
        {
          timestamp: new Date().toISOString(),
          statusChange: `Criada com prioridade: ${newIdeaPriority}`,
        },
      ],
    };

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIdeaData),
      });
      const createdIdea = await response.json();
      setIdeas([...ideas, createdIdea]);
      setNewIdeaText('');
      setNewIdeaPriority(Priority.Medium);
    } catch (error) {
      console.error('Failed to add idea:', error);
    }
  };

    const handleStatusChange = async (id: number, newStatus: IdeaStatus) => {
    const ideaToUpdate = ideas.find((idea) => idea.id === id);
    if (!ideaToUpdate) return;

    // Prompt for a comment
    const comment = window.prompt(`Adicionar um comentário para a mudança para "${newStatus}":`);

    const newCommit = {
      timestamp: new Date().toISOString(),
      statusChange: `Status alterado para: ${newStatus}`,
      comment: comment || undefined, // Add comment if it exists
    };
    const updatedCommits = [...ideaToUpdate.commits, newCommit];

    try {
      await fetch(`/api/ideas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, commits: updatedCommits }),
      });

      setIdeas(
        ideas.map((idea) =>
          idea.id === id ? { ...idea, status: newStatus, commits: updatedCommits } : idea
        )
      );
    } catch (error) {
      console.error('Failed to update idea status:', error);
    }
  };

  const handleDeleteIdea = async (id: number) => {
    try {
      await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      });
      setIdeas(ideas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  };

  const toggleIdeaExpansion = (id: number) => {
    setExpandedIdeaId(expandedIdeaId === id ? null : id);
  };

  const priorityColorClass = (priority: Priority) => {
    switch (priority) {
      case Priority.High: return 'border-l-4 border-red-500';
      case Priority.Medium: return 'border-l-4 border-yellow-500';
      case Priority.Low: return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
       <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Gerenciador de Ideias</h1>
          <p className="text-gray-500 mt-2">Capture suas ideias e acompanhe seu progresso.</p>
        </header>

      <main>
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <form onSubmit={handleAddIdea}>
            <div className="flex items-center gap-4 mb-4">
              <input
                id="idea-input"
                type="text"
                value={newIdeaText}
                onChange={(e) => setNewIdeaText(e.target.value)}
                placeholder="Qual é a sua próxima grande ideia?"
                className="flex-grow p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label htmlFor="priority-select" className="font-medium text-gray-600">Prioridade:</label>
                <select 
                  id="priority-select"
                  value={newIdeaPriority}
                  onChange={(e) => setNewIdeaPriority(e.target.value as Priority)}
                  className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={Priority.Low}>Baixa</option>
                  <option value={Priority.Medium}>Média</option>
                  <option value={Priority.High}>Alta</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
              >
                Adicionar Ideia
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {ideas.length === 0 ? (
            <div className="text-center py-10 px-6 bg-white rounded-xl shadow-md">
              <p className="text-gray-500">Nenhuma ideia registrada ainda. Adicione uma acima!</p>
            </div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.id} className={`bg-white rounded-xl shadow-md transition-all hover:shadow-lg ${priorityColorClass(idea.priority)}`}>
                <div className="p-5 flex items-center justify-between">
                  <span className="text-gray-700 text-lg font-medium">{idea.text}</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={idea.status}
                      onChange={(e) => handleStatusChange(idea.id, e.target.value as IdeaStatus)}
                      className={`p-2 rounded-md text-sm font-medium border-2 ${
                        idea.status === IdeaStatus.New ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        idea.status === IdeaStatus.InProgress ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}>
                      <option value={IdeaStatus.New}>Nova</option>
                      <option value={IdeaStatus.InProgress}>Em Execução</option>
                      <option value={IdeaStatus.Completed}>Concluída</option>
                    </select>
                    <button
                      onClick={() => toggleIdeaExpansion(idea.id)}
                      className="text-gray-400 hover:text-indigo-500 transition-colors"
                      aria-label="Ver histórico"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Deletar ideia"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                </div>
                {expandedIdeaId === idea.id && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <h4 className="font-semibold mt-3 mb-2 text-gray-600">Histórico de Commits:</h4>
                    <ul className="list-disc list-inside text-gray-500 text-sm space-y-1">
                      {idea.commits.map((commit, index) => (
                        <li key={index}>
                                                                              <span className="font-mono text-xs">{new Date(commit.timestamp).toLocaleString()}</span>: {commit.statusChange}
                          {commit.comment && (
                            <p className="pl-4 text-xs italic text-gray-400">- "{commit.comment}"</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}