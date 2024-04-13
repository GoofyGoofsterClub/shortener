const DEFAULT_FUTABA_DELAY = 60;
var FUTABA_PARAMS = {};

const FutabaParam = (param) => { return FUTABA_PARAMS[param] ?? 'Unspecified' };

const FUTABA_SCENARIOS = {
    "WELCOME": {
        "text": "<span>I&nbsp;wonder&nbsp;who&nbsp;this&nbsp;is,&nbsp;please&nbsp;log&nbsp;in.<br><br></span><input type='password' placeholder='User Key'><span>&nbsp;</span><button class='input-button'>Log in</button><br>",
        "exec": {
            "after": async (dom) => {
                dom.querySelector('button').onclick = async (self) => {
                    self.target.disabled = true;
                    dom.querySelector('input').disabled = true;
                    let accessKey = dom.querySelector('input').value;

                    let apiResponse = await fetch(`/api/session/authenticate?key=${accessKey}`);
                    let apiJsonResponse = await apiResponse.json();

                    if (!('success' in apiJsonResponse.data))
                    {
                        anime({
                            targets: dom.querySelector('input'),
                            translateX: [
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: 0, duration: 50 }
                            ],
                                background: [
                                    { value: 'rgba(251, 6, 6, 0.04)', duration: 10 },
                                    { value: 'rgba(251,6,6,0)', duration: 10, delay: 440 }
                                ]
                        });
                        self.target.disabled = false;
                        dom.querySelector('input').disabled = false;
                        return;
                    }

                    let success = apiJsonResponse.data.success;
                    
                    if (!success)
                    {
                        anime({
                            targets: dom.querySelector('input'),
                            translateX: [
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: -10, duration: 50 },
                            { value: 10, duration: 50 },
                            { value: 0, duration: 50 }
                            ],
                                background: [
                                    { value: 'rgba(251, 6, 6, 0.04)', duration: 10 },
                                    { value: 'rgba(251,6,6,0)', duration: 10, delay: 440 }
                                ]
                        });
                        self.target.disabled = false;
                        dom.querySelector('input').disabled = false;
                        return;
                    }
                    alert("NICE");
                };
            }
        }
    },
    "WELCOME_USER": {
        "text": "<span>Welcome&nbsp;back,&nbsp;mishashto!"
    },
    "WRONG_DATA": {},
    "ERROR": {},
    "GOODBYE": {},
    "MISHASHTO": {
        "text": "<span>AMERIKA&nbsp;YA&nbsp;:D</span>"
    },
    "__DEBUG": {
        "text": "<span>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.&nbsp;Donec&nbsp;maximus&nbsp;laoreet&nbsp;nisl&nbsp;vitae&nbsp;tincidunt.&nbsp;Mauris&nbsp;a&nbsp;ullamcorper&nbsp;ipsum.&nbsp;Morbi&nbsp;at&nbsp;mi&nbsp;elit.&nbsp;Ut&nbsp;at&nbsp;ante&nbsp;mauris.&nbsp;In&nbsp;id&nbsp;nulla&nbsp;lorem.&nbsp;Integer&nbsp;rhoncus&nbsp;mollis&nbsp;suscipit.&nbsp;Donec&nbsp;malesuada&nbsp;libero&nbsp;eu&nbsp;eros&nbsp;tristique,&nbsp;eget&nbsp;placerat&nbsp;ligula&nbsp;dignissim.&nbsp;Quisque&nbsp;laoreet&nbsp;id&nbsp;arcu&nbsp;vel&nbsp;sagittis.</span>"
    }
};
const CUSTOM_SPEECH_ELEMENTS = {
    "SLEEP": async function (e) {
        PauseFutabaAnimation();
        await sleep(e.getAttribute("data-ms"));
        ResumeFutabaAnimation();
    },
    "CHANGE_GLOBAL_SPEED": async function (e) {
        DEFAULT_FUTABA_DELAY = parseInt(e.getAttribute("data-ms"));
    }
};
const DO_NOT_TYPE_IN_SPEECH_ELEMENTS = ["BUTTON", "INPUT", "TEXTAREA"];
var SPEECH_BUBBLE_ELEMENT;
var futabaTalking;

window.onload = async function ()
{
    SPEECH_BUBBLE_ELEMENT = document.querySelector('.character-speaking');
    futabaTalking = anime({
    targets: '.futaba',
        
        translateY: [-2, 3],
    rotate: [-4, 4],
    direction: 'alternate',
    loop: true,
    easing: 'easeOutInBounce'
    });

    futabaTalking.pause();

    // await SpeakText(FUTABA_SCENARIOS.WELCOME.text, DEFAULT_FUTABA_DELAY);
}

async function LoginLandingButtonPressed()
{
    await anime({
        targets: ".login-box",
        opacity: 1,
        scaleY: "100%",
        duration: 800,
        complete: async function ()
        {
            await anime({
                targets: ".futaba-arrow,.futaba,.character-name,.character-speaking",
                opacity: 1,
                scaleY: "100%",
                duration: 800,
                complete: async function ()
                {
                    await SetScenario('WELCOME');
                }
            });
        }
    });
}

async function SetScenario(scenarioName)
{
    if (FUTABA_SCENARIOS[scenarioName].exec && 'before' in FUTABA_SCENARIOS[scenarioName].exec)
        FUTABA_SCENARIOS[scenarioName].exec['after'](SPEECH_BUBBLE_ELEMENT);    
    await SpeakText(FUTABA_SCENARIOS[scenarioName].text, DEFAULT_FUTABA_DELAY);
    if (FUTABA_SCENARIOS[scenarioName].exec && 'after' in FUTABA_SCENARIOS[scenarioName].exec)
        FUTABA_SCENARIOS[scenarioName].exec['after'](SPEECH_BUBBLE_ELEMENT);    
}

async function SpeakText(text, delay)
{
    let parser = new DOMParser();
    let _text = parser.parseFromString(text, "text/html");
    text = Array.from(_text.body.querySelectorAll("*"));
    let originalDelay = delay;
    SPEECH_BUBBLE_ELEMENT.innerText = '';
    let inElement = false;
    ResumeFutabaAnimation();

    let appearancesOfInputElements = 0;
    for (l = 0; l < text.length; l++)
    {   
        let newAttr = text[l].cloneNode(false);
        if (newAttr.tagName in CUSTOM_SPEECH_ELEMENTS)
        {
            await CUSTOM_SPEECH_ELEMENTS[newAttr.tagName](newAttr);
            continue;    
        }
        SPEECH_BUBBLE_ELEMENT.appendChild(newAttr);
        if (DO_NOT_TYPE_IN_SPEECH_ELEMENTS.includes(newAttr.tagName) || Array.from(newAttr.classList ?? []).includes("speech-do-not-animate")) {
            appearancesOfInputElements++;
            console.log(newAttr, `   `, appearancesOfInputElements);
            newAttr.style.opacity = 0;
            newAttr.style.transform = "translateY(-10px)";
            console.log("STOP!");
            newAttr.innerHTML = text[l].innerHTML;
            anime({
                targets: newAttr,
                opacity: 1,
                translateY: 0,
                duration: 300,
                delay: 200 * appearancesOfInputElements
            });
            continue;
        } else appearancesOfInputElements = 0;
        for (lt = 0; lt < text[l].innerText.length; lt++)
        {
            newAttr.innerText += text[l].innerText[lt];
            await sleep(delay);
        }
    }

    PauseFutabaAnimation();
    return true;
}


function PauseFutabaAnimation()
{
    anime({
        targets: '.loading-dots',
        opacity: 0,
        duration: 333,
        easing: 'easeOutSine'
    });
    futabaTalking.pause();
}

function ResumeFutabaAnimation()
{
    anime({
        targets: '.loading-dots',
        opacity: 1,
        duration: 333,
        easing: 'easeOutSine'
    });
    futabaTalking.play();
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}