$(document).ready(function () {
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

  function generateTaskId() {
    return nextId++;
  }

  function createTaskCard(task) {
    let cardClass = getTaskCardClass(task);
    
    return `
      <div id="task-${task.id}" class="card mb-3 task-card ${cardClass}" draggable="true">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">Deadline: ${task.deadline}</small></p>
          <button type="button" class="btn btn-danger btn-sm delete-btn">Delete</button>
        </div>
      </div>
    `;
  }

  function getTaskCardClass(task) {
    let deadline = dayjs(task.deadline);
    let today = dayjs();
    let daysUntilDeadline = deadline.diff(today, 'day');

    if (daysUntilDeadline < 0) {
      return 'border-danger';
    } else if (daysUntilDeadline === 0 || daysUntilDeadline === 1) {
      return 'border-warning';
    } else {
      return '';
    }
  }

  function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
      let taskCard = createTaskCard(task);
      $(`#${task.status}-cards`).append(taskCard);
    });

    $('.task-card').on('dragstart', function(event) {
      $(this).addClass('dragging');
    });

    $('.lane').on('dragover', function(event) {
      event.preventDefault();
    });

    $('.lane').on('drop', function(event) {
      let laneId = $(this).attr('id');
      let taskId = $('.dragging').attr('id').replace('task-', '');

      let task = taskList.find(task => task.id === parseInt(taskId));
      task.status = laneId;
      saveTasks();
      renderTaskList();
    });

    $('.delete-btn').click(function(event) {
      let taskId = $(this).closest('.card').attr('id').replace('task-', '');
      taskList = taskList.filter(task => task.id !== parseInt(taskId));
      saveTasks();
      renderTaskList();
    });
  }

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

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
  }

  function resetForm() {
    $('#task-form')[0].reset();
  }

  renderTaskList();

  $('#task-form').submit(handleAddTask);

  $('#deadline').datepicker({
    dateFormat: 'yy-mm-dd'
  });
});

