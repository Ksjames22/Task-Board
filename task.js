$(document).ready(function () {
    // Initialize task list and nextId from localStorage or default values
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
  
    // Function to generate a unique task ID
    function generateTaskId() {
      return nextId++;
    }
  
    // Function to create HTML for a task card
    function createTaskCard(task) {
      return `
        <div id="task-${task.id}" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><small class="text-muted">Deadline: ${task.deadline}</small></p>
            <button type="button" class="btn btn-danger btn-sm delete-btn">Delete</button>
          </div>
        </div>
      `;
    }
  
    // Function to render the task list
    function renderTaskList() {
      $('#todo-cards').empty();
      $('#in-progress-cards').empty();
      $('#done-cards').empty();
  
      taskList.forEach(task => {
        let taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
      });
  
      $('.card').draggable({
        revert: 'invalid',
        helper: 'clone',
        containment: 'document',
        zIndex: 100,
        scroll: false
      });
  
      $('.lane').droppable({
        accept: '.card',
        drop: handleDrop
      });
  
      $('.delete-btn').click(handleDeleteTask);
    }
  
    // Function to handle adding a new task
    function handleAddTask(event) {
      event.preventDefault();
  
      let title = $('#title').val().trim();
      let description = $('#description').val().trim();
      let deadline = $('#deadline').val().trim();
  
      if (!title || !description || !deadline) {
        alert('Please fill in all fields.');
        return;
      }
  
      let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        deadline: deadline,
        status: 'todo' // Initial status
      };
  
      taskList.push(newTask);
      saveTasks();
      $('#formModal').modal('hide');
      renderTaskList();
      resetForm();
    }
  
    // Function to handle deleting a task
    function handleDeleteTask(event) {
      let taskId = $(this).closest('.card').attr('id').replace('task-', '');
      taskList = taskList.filter(task => task.id !== parseInt(taskId));
      saveTasks();
      renderTaskList();
    }
  
    // Function to handle dropping a task into a new status lane
    function handleDrop(event, ui) {
      let laneId = $(this).attr('id');
      let taskId = ui.draggable.attr('id').replace('task-', '');
  
      let task = taskList.find(task => task.id === parseInt(taskId));
      task.status = laneId;
      saveTasks();
      renderTaskList();
    }
  
    // Function to save tasks to localStorage
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(taskList));
    }
  
    // Function to reset form fields after task submission
    function resetForm() {
      $('#task-form')[0].reset();
    }
  
    // Initialize the application on page load
    renderTaskList();
  
    $('#task-form').submit(handleAddTask);
  
    $('#deadline').datepicker({
      dateFormat: 'yy-mm-dd'
    });
  });
  
