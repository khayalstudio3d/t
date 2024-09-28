import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    check: [],
    finished: [],
  });

  const [users, setUsers] = useState([]); // List of users to assign tasks
  const [newTask, setNewTask] = useState({
    task_name: '',
    task_status: 1,
    assignedUser: '', // Track which user the task is assigned to (using user_id)
  });

  // Fetch tasks and users on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get('https://taskmanagerkhayal.fly.dev/users'); // Modify URL to match your API
        const usersData = usersResponse.data.results;
        setUsers(usersData); // Expecting an array of { user_id, username }

        // Fetch tasks
        const tasksResponse = await axios.get('https://taskmanagerkhayal.fly.dev/tasks'); // Modify URL to match your API
        const taskData = tasksResponse.data.results;

        // Organize tasks based on their task_status
        const organizedTasks = {
          todo: [],
          inProgress: [],
          check: [],
          finished: [],
        };

        taskData.forEach(task => {
          switch (task.task_status) {
            case 1:
              organizedTasks.todo.push(task);
              break;
            case 2:
              organizedTasks.inProgress.push(task);
              break;
            case 3:
              organizedTasks.check.push(task);
              break;
            case 4:
              organizedTasks.finished.push(task);
              break;
            default:
              break;
          }
        });

        // Set the tasks
        setTasks(organizedTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle drag and drop functionality
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    const movedTask = tasks[sourceColumn][source.index];

    // If task is being moved between columns
    if (sourceColumn !== destinationColumn) {
      const updatedSourceTasks = [...tasks[sourceColumn]];
      const updatedDestinationTasks = [...tasks[destinationColumn]];

      updatedSourceTasks.splice(source.index, 1);
      updatedDestinationTasks.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [sourceColumn]: updatedSourceTasks,
        [destinationColumn]: updatedDestinationTasks,
      });

      // Optionally, send an API request to update task status on the server
      movedTask.task_status = getColumnStatus(destinationColumn);
      axios.put(`https://taskmanagerkhayal.fly.dev/dashboard?task_id=${movedTask.task_id}&task_status=${movedTask.task_status}`);
    }
  };

  // Map column IDs to task statuses
  const getColumnStatus = (columnId) => {
    switch (columnId) {
      case 'todo':
        return 1;
      case 'inProgress':
        return 2;
      case 'check':
        return 3;
      case 'finished':
        return 4;
      default:
        return null;
    }
  };

  // Handle new task form submission
  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the new task to the server with user_id
      const response = await axios.post('https://taskmanagerkhayal.fly.dev/create-task', {
       
        
        
        userid: newTask.assignedUser,task_name: newTask.task_name,task_status: newTask.task_status, // Send user_id
      });
      const fetchData = async () => {
        try {
          // Fetch users
          const usersResponse = await axios.get('https://taskmanagerkhayal.fly.dev/users'); // Modify URL to match your API
          const usersData = usersResponse.data.results;
          setUsers(usersData); // Expecting an array of { user_id, username }
  
          // Fetch tasks
          const tasksResponse = await axios.get('https://taskmanagerkhayal.fly.dev/tasks'); // Modify URL to match your API
          const taskData = tasksResponse.data.results;
  
          // Organize tasks based on their task_status
          const organizedTasks = {
            todo: [],
            inProgress: [],
            check: [],
            finished: [],
          };
  
          taskData.forEach(task => {
            switch (task.task_status) {
              case 1:
                organizedTasks.todo.push(task);
                break;
              case 2:
                organizedTasks.inProgress.push(task);
                break;
              case 3:
                organizedTasks.check.push(task);
                break;
              case 4:
                organizedTasks.finished.push(task);
                break;
              default:
                break;
            }
          });
  
          // Set the tasks
          setTasks(organizedTasks);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
      
      console.log(newTask.assignedUser);

      // Refresh task list after creating the new task
      setTasks((prevTasks) => ({
        ...prevTasks,
        todo: [...prevTasks.todo, response.data],
      }));

      setNewTask({ task_name: '', task_status: 1, assignedUser: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Task Management</h1>

      {/* Task creation form */}
      <form onSubmit={handleNewTaskSubmit} className="new-task-form">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.task_name}
          onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
          required
        />
        <select
          value={newTask.assignedUser}
          onChange={(e) => setNewTask({ ...newTask, assignedUser: e.target.value })}
          required
        >
          <option value="">Assign to User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <button type="submit">Create Task</button>
      </form>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="columns">
          {/* Render columns for different task statuses */}
          {['todo', 'inProgress', 'check', 'finished'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>{status === 'todo' ? 'To Do' : status === 'inProgress' ? 'In Progress' : status === 'check' ? 'Check' : 'Finished'}</h2>
                  {tasks[status].map((task, index) => (
                    <Draggable key={task.task_id} draggableId={String(task.task_id)} index={index}>
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-body">
                            <h5 className="card-title">{task.task_name}</h5>
                            <p className="card-username">Assigned to: {task.username}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default AdminPage;
