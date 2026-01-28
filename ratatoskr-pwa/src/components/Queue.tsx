import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import type { Task } from '../context/AppContext';
import { ApiKeyBanner } from './ApiKeyBanner';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

const Queue: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Loading...</div>;
  }

  const { julesApiKey, tasks, setTasks } = context;
  const availableTasks = julesApiKey ? tasks : [];

  // Only show tasks that are not Completed
  const activeTasks = availableTasks.filter(task => task.status !== 'Completed' && !task.isArchived);
  const inProgressTasks = activeTasks.filter(task => task.status === 'In Progress');
  const pendingTasks = activeTasks.filter(task => task.status === 'Pending');

  const handleRowClick = (task: Task) => {
    navigate(`/tasks/${task.id}`, { state: { task } });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(pendingTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const nonActiveTasks = tasks.filter(t => t.status === 'Completed' || t.isArchived);
    setTasks([...inProgressTasks, ...items, ...nonActiveTasks]);
  };

  return (
    <div className="p-4 md:p-6">
      <ApiKeyBanner />
      <h1 className="text-2xl font-bold mb-6">Queue</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">Tasks that are waiting to be processed. Drag the ☰ handle to reorder pending tasks.</p>

      <div className="overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-dark">
            <thead className="bg-gray-50 dark:bg-primary-dark">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10"></th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              </tr>
            </thead>

            {/* In Progress Tasks */}
            <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-secondary-dark">
              {inProgressTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleRowClick(task)}
                  className="hover:bg-gray-100 dark:hover:bg-primary-dark cursor-pointer border-l-4 border-yellow-400"
                >
                  <td className="px-6 py-4 text-center text-gray-300">
                    <span title="In Progress tasks cannot be reordered">🔒</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.repo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.name}</td>
                </tr>
              ))}
            </tbody>

            {/* Pending Tasks */}
            <Droppable droppableId="pending-tasks">
              {(provided) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-secondary-dark"
                >
                  {pendingTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={() => handleRowClick(task)}
                          className={`hover:bg-gray-100 dark:hover:bg-primary-dark cursor-pointer border-l-4 border-transparent ${snapshot.isDragging ? 'bg-blue-50 dark:bg-blue-900/20 shadow-lg border-blue-400' : ''}`}
                        >
                          <td className="px-6 py-4 w-10 text-center" {...provided.dragHandleProps}>
                            <span className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">☰</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.repo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.name}</td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {activeTasks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        The queue is empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Queue;
