import { Autobind } from '../decorators/autobind.js';
import { Dragable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import { Component } from './base-component.js';

export class ProjectItem
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
