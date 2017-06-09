function Button(icon, className, onClick) {
  let button = document.createElement('button');
  let buttonContent = document.createElement('i');
  buttonContent.classList.add(icon)
  button.appendChild(buttonContent)
  button.setAttribute("class", className);
  button.addEventListener('click', onClick)

  return button
}