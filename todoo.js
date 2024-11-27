 document.addEventListener('DOMContentLoaded', () => {
            const input = document.getElementById('todotinput');
            const alertBox = document.getElementById('alert');
            const listItems = document.getElementById('ListItems');

            function createTodoItems() {
                const text = input.value.trim();

                if (text === '') {
                    showAlert('Please enter a TODO item.');
                    return;
                }

                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" class="todoCheckbox">
                    <span>${text}</span>
                    <div class="todoActions">
                        <img src="pen2.png" alt="Edit" class="todoControl" onclick="editTodoItem(this);">
                        <img src="dell.png" alt="Delete" class="todoControl" onclick="removeTodoItem(this);">
                    </div>
                `;
                listItems.appendChild(li);
                input.value = '';
            }

            function showAlert(message) {
                alert(message);
            }

            window.removeTodoItem = function(element) {
                const li = element.parentElement.parentElement;
                li.remove();
            }

            window.editTodoItem = function(element) {
                const li = element.parentElement.parentElement;
                const span = li.querySelector('span');
                const newText = prompt('Edit your TODO item:', span.textContent);

                if (newText !== null && newText.trim() !== '') {
                    span.textContent = newText.trim();
                }
            }

            document.getElementById('add').addEventListener('click', createTodoItems);

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    createTodoItems();
                }
            });
        });
    