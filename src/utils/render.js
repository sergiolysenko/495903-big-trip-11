const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  INSERTBEFORE: `insertbefore`,
};

const replace = (newComponent, oldComponent) => {
  const newElem = newComponent.getElement();
  const oldElem = oldComponent.getElement();
  const parentElem = oldElem.parentElement;
  const isExistElem = !!(newElem && oldElem && parentElem);
  if (isExistElem) {
    parentElem.replaceChild(newElem, oldElem);
  }
};

const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.INSERTBEFORE:
      container.before(component.getElement());
      break;
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {createElement, RenderPosition, render, replace, remove};
