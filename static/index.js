function onClickWithoutMovement(element, callback, threshold = 2)
{
    let active = false;
    let moved = false;
    const mouseDown = (e) => {
        active = true;
        moved = false;
    }
    const touchStart = (e) => {
        active = true;
        moved = false;
    }
    const mouseMove = (e) => {
        if (active) moved = true;
    }
    const touchMove = (e) => {
        if (active) moved = true;
    }
    const mouseUp = (e) => {
        if (!moved) callback(e);
        active = false;
    }
    const touchEnd = (e) => {
        if (!moved) callback(e);
        active = false;
    }
    element.addEventListener('mousedown', mouseDown);
    element.addEventListener('touchstart', touchStart);
    element.addEventListener('mousemove', mouseMove);
    element.addEventListener('touchmove', touchMove);
    element.addEventListener('mouseup', mouseUp);
    element.addEventListener('touchend', touchEnd);
    return () => (element.removeEventListener('mousedown', mouseDown),
        element.removeEventListener('touchstart', touchStart),
        element.removeEventListener('mouseup', mouseUp),
        element.removeEventListener('touchend', touchEnd))
}

class ResizeController
{
    init(root)
    {

    }

    destroy()
    {

    }
}

class DragController
{

    init(root, handle)
    {

    }

    destroy()
    {

    }
}

class WindowElement extends HTMLElement
{
    dragger = new DragController();
    resizer = new ResizeController();

    connectedCallback()
    {
        this.dragger.init(this, this);
        this.resizer.init(this);
    }

    disconnectedCallback()
    {
        this.dragger.destroy();
        this.resizer.destroy();
    }
    

}