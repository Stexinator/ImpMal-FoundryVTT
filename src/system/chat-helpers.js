
export default class ChatHelpers 
{


    static scrollToMessage(messageId)
    {
        let message = ui.chat.element.find(`[data-message-id='${messageId}']`)[0];
        
        if (!message)
        {
            return;
        }
        
        ui.chat.element.find("ol").animate({scrollTop: message.offsetTop}, 800);
        // Scrolling into view will remove the highlight, so add it for 1 second then remove
        message.classList.add("highlight-delayed");
        setTimeout((message) => 
        {
            message.classList.remove("highlight-delayed");
        }, 1000, message);
    }

    static highlightMessage(messageId)
    {
        let message = ui.chat.element.querySelector(`[data-message-id='${messageId}']`);
        message?.classList.add("highlight");
    }

    static unhighlightMessage(messageId)
    {
        let message = ui.chat.element.querySelector(`[data-message-id='${messageId}']`);
        message?.classList.remove("highlight");
    }

    static removeGMOnlyElements(html)
    {
        if (!game.user.isGM)
        {
            html.querySelector(".gm-only").remove();
        }
    }


    static addOpposedHighlightListeners(html)
    {
        html.querySelectorAll(".opposed .token").forEach(element => {
            element.addEventListener("mouseover", TokenHelpers.onHoverInOpposedImg.bind(TokenHelpers))
        });;
        html.querySelectorAll(".opposed .token").forEach(element => {
            element.addEventListener("click", TokenHelpers.onClickOpposedImg.bind(TokenHelpers));
        });
        html.querySelectorAll(".opposed .token").forEach(element => {
            element.addEventListener("dblclick", TokenHelpers.onDoubleClickOpposedImg.bind(TokenHelpers));
        });
        html.querySelectorAll(".opposed .token").forEach(element => {
            element.addEventListener("mouseout", TokenHelpers.onHoverOutOpposedImg.bind(TokenHelpers));
        });
    }
}