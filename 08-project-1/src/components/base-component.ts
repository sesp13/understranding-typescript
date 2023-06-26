namespace App {
  // Base class for those which interact with the dom
  export abstract class Component<
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
}
