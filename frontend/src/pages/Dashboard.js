import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI, userAPI } from '../services/apiClient';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [filterUserId, setFilterUserId] = useState(null);
    const [newTask, setNewTask] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const loadData = useCallback(async () => {
        if (!currentUser) return;
        try {
            setLoading(true);
            const tasksResponse = await taskAPI.getTasks(currentUser.org_id);
            setTasks(tasksResponse.data);
            const usersResponse = await userAPI.getUsers(currentUser.org_id);
            setUsers(usersResponse.data);
        } catch (err) {
            setError('Erreur lors du chargement');
            console.error(err);
        } finally {
            setLoading(false);
        }
    },[currentUser]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        loadData();
    }, [currentUser, navigate, loadData]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) {
            setError('Titre requis');
            return;
        }
        if (!selectedAssignee) {
            setError('Sélectionne un assigné');
            return;
        }
        try {
            await taskAPI.createTask(newTask, '', parseInt(selectedAssignee), currentUser.org_id);
            setNewTask('');
            setSelectedAssignee('');
            loadData();
        } catch (err) {
            setError('Erreur création tâche');
        }
    };

    const handleToggleTask = async (taskId, currentStatus) => {
        try {
            await taskAPI.updateTask(taskId, !currentStatus);
            loadData();
        } catch (err) {
            setError('Erreur mise à jour');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Supprimer?')) {
            try {
                await taskAPI.deleteTask(taskId);
                loadData();
            } catch (err) {
                setError('Erreur suppression');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedProfile');
        navigate('/');
    };

    if (loading) return <div className="dashboard-container">Chargement...</div>;

    const filteredTasks = tasks.filter((task) => {
        const isCompleted = task.completed;
        const matchesTab = activeTab === 'active' ? !isCompleted : isCompleted;
        const matchesFilter = !filterUserId || task.assigned_to === filterUserId;
        return matchesTab && matchesFilter;
    });

    const activeCount = tasks.filter((t) => !t.completed).length;
    const completedCount = tasks.filter((t) => t.completed).length;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>📋 Task Manager</h1>
                </div>
                <div className="header-right">
                    <span className="user-name">{currentUser.name}</span>
                    <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="sidebar">
                    <h3>👥 Membres</h3>
                    <div className="members-list">
                        <div className={`member-item ${!filterUserId ? 'active' : ''}`} onClick={() => setFilterUserId(null)}>
                            Tous les membres
                        </div>
                        {users.map((user) => (
                            <div key={user.id} className={`member-item ${filterUserId === user.id ? 'active' : ''}`} onClick={() => setFilterUserId(user.id)}>
                                {user.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="main-panel">
                    <div className="create-task-section">
                        <h2>✨ Créer une tâche</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="form-row">
                                <input type="text" placeholder="Titre" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                                <select value={selectedAssignee} onChange={(e) => setSelectedAssignee(e.target.value)}>
                                    <option value="">Assigner à...</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                                <button type="submit" className="btn-primary">Ajouter</button>
                            </div>
                        </form>
                        {error && <div className="error-message">{error}</div>}
                    </div>

                    <div className="tabs">
                        <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                            En cours ({activeCount})
                        </button>
                        <button className={`tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                            Complétées ({completedCount})
                        </button>
                    </div>

                    <div className="tasks-list">
                        {filteredTasks.length === 0 ? (
                            <div className="empty-state">Aucune tâche</div>
                        ) : (
                            filteredTasks.map((task) => (
                                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                    <div className="task-content">
                                        <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id, task.completed)} className="task-checkbox" />
                                        <div className="task-info">
                                            <div className="task-title">{task.title}</div>
                                            <div className="task-assigned">Assignée à {users.find((u) => u.id === task.assigned_to)?.name || 'Inconnu'}</div>
                                        </div>
                                    </div>
                                    <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="stats-section">
                        <div className="stat"><strong>{activeCount}</strong> en cours</div>
                        <div className="stat"><strong>{completedCount}</strong> complétées</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;