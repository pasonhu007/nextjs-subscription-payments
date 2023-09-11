(function() {
    // Inject CSS styles
    var styles = `
        #chatButton {
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .modal {
            display: none;
            position: fixed;
            bottom: 10px;
            right: 10px;
            border: 1px solid #888;
            background-color: #fefefe;
            z-index: 1;
        }
        .modal-content {
            position: relative;
            padding: 0;
            margin: 0;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            position: absolute;
            right: 0;
            top: 0;
            padding: 10px;
            cursor: pointer;
        }
    `;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Inject the Chat button and modal
    var chatButtonHTML = '<button id="chatButton">Chat</button>';
    var chatModalHTML = `
        <div id="chatModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <iframe src="http://localhost:3000/bot/bot-chat?botId=66c63b11-7d1b-4153-9e85-3ec9fb3e177d" frameborder="0" width="433" height="800"></iframe>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatButtonHTML + chatModalHTML);

    // Event Listeners
    document.getElementById('chatButton').addEventListener('click', function() {
        document.getElementById('chatModal').style.display = "block";
    });

    document.getElementsByClassName('close')[0].addEventListener('click', function() {
        document.getElementById('chatModal').style.display = "none";
    });
})();
