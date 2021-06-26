document.body.addEventListener("contextmenu", e => {
    // If the message text is right clicked, the grandparent element will be the message element,
    // and if the message background is clicked, the parent element will be the message element.
    let message = e.target;
    let isMessage = false;
    for (let i = 0; i < 4; i++) {
        message = message.parentElement;
        if (elementHasClassPrefix(message, "message")) {
            isMessage = true;
            break;
        }
    }

    // Only show the context menu if the message was clicked,
    // and the clicked thing doesn't have its own context menu.
    if (!isMessage
        || elementHasClassPrefix(e.target, "username")
        || elementHasClassPrefix(e.target, "repliedTextPreview")
        || elementHasClassPrefix(e.target, "avatar")) {
            return;
        }

    // Temporarily position the "..." button at the mouse cursor,
    // so that the context menu pops up there. Then move it back again.
    const moreButton = message.querySelector("[aria-label='More']");
    moreButton.style.position = "fixed";
    moreButton.style.top = e.clientY + "px";
    moreButton.style.left = e.clientX + "px";
    moreButton.click();
    moreButton.style.position = "";
    moreButton.style.top = "";
    moreButton.style.left = "";


    // Add "add reaction" item to context menu
    const menu = document.getElementById("message-actions").firstChild;
    const referenceItem = menu.firstChild;
    const reactionItem = referenceItem.cloneNode(true);
    const reactButton = message.querySelector("[aria-label='Add Reaction']");
    reactionItem.id = "message-actions-react";
    reactionItem.children[0].innerHTML = "Add Reaction";
    reactionItem.children[1].innerHTML = reactButton.innerHTML;
    menu.insertBefore(reactionItem, referenceItem);

    // Focus the reference item so that it gets the "focused-???" class,
    // then find this class (we only know it starts with focused-),
    // and get the full name. Then use it with the self-made events.
    referenceItem.focus();
    const focusedClassName = Array.from(referenceItem.classList).find(x => x.startsWith("focused-"));
    referenceItem.classList.remove(focusedClassName);
    referenceItem.blur();
    // Discord's own event is unreliable after making changes here,
    // therefore this one is needed to make it more stable.
    referenceItem.addEventListener("mouseenter", () => referenceItem.classList.add(focusedClassName));

    reactionItem.addEventListener("click", () => reactButton.click());
    reactionItem.addEventListener("mouseenter", () => {
        reactionItem.classList.add(focusedClassName);
        // For some reason it keeps being highlighted otherwise.
        referenceItem.classList.remove(focusedClassName);
    });
    reactionItem.addEventListener("focus", () => reactionItem.classList.add(focusedClassName));
    reactionItem.addEventListener("mouseleave", () => reactionItem.classList.remove(focusedClassName));
    reactionItem.addEventListener("blur", () => reactionItem.classList.remove(focusedClassName));
});

function elementHasClassPrefix(element, classPrefix) {
    return Array.from(element.classList).some(x => x.startsWith(classPrefix));
}