enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project state management
type Listener<T> = (items: T[]) => void;

abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id == projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners(): void {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects]);
    }
  }
}

const projectState = ProjectState.getInstance();

// Drag & Drop interfaces
interface Dragable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Validation
interface Validatable {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true;
  const { value, required, minLength, maxLength, min, max } = validatableInput;
  if (required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }

  if (
    minLength !== null &&
    minLength !== undefined &&
    typeof value == 'string'
  ) {
    isValid = isValid && value.length > minLength;
  }

  if (
    maxLength !== null &&
    maxLength !== undefined &&
    typeof value == 'string'
  ) {
    isValid = isValid && value.length < maxLength;
  }

  if (min !== null && min !== undefined && typeof value == 'number') {
    isValid = isValid && value >= min;
  }

  if (max !== null && max !== undefined && typeof value == 'number') {
    isValid = isValid && value <= max;
  }

  return isValid;
}

// Decorators
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjustedDescriptor;
}

// Base class for those which interact with the dom
abstract class Component<
  HostType extends HTMLElement,
  ElementType extends HTMLElement
> {
  templateElement: HTMLTemplateElement;
  hostElement: HostType;
  element: ElementType;

  constructor(data: {
    templateId: string;
    hostElementId: string;
    insertAtStart: boolean;
    newElementId?: string;
  }) {
    const { templateId, hostElementId, insertAtStart, newElementId } = data;

    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as HostType;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as ElementType;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;

  abstract renderContent(): void;
}

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Dragable
{
  private project: Project;

  get persons() {
    return this.project.people === 1 ? 'person' : 'persons';
  }

  constructor(hostElementId: string, project: Project) {
    super({
      templateId: 'single-project',
      hostElementId,
      insertAtStart: false,
      newElementId: project.id,
    });
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @Autobind
  dragEndHandler(_: DragEvent): void {}

  configure(): void {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent =
      this.project.people.toString() + ` ${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super({
      templateId: 'project-list',
      hostElementId: 'app',
      insertAtStart: false,
      newElementId: `${type}-projects`,
    });
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      const listEl = this.element.querySelector('ul');
      listEl?.classList.add('droppable');
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const id = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      id,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul');
    listEl?.classList.remove('droppable');
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        } else {
          return project.status === ProjectStatus.Finished;
        }
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`);
    listEl!.innerHTML = '';

    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super({
      templateId: 'project-input',
      hostElementId: 'app',
      insertAtStart: true,
      newElementId: 'user-input',
    });

    this.titleInputElement = this.element.querySelector('#title')!;
    this.descriptionInputElement = this.element.querySelector('#description')!;
    this.peopleInputElement = this.element.querySelector('#people')!;
    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent(): void {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

//Execution
new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
