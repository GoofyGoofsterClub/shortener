const DEFAULT_FUTABA_DELAY = 60;
var FUTABA_PARAMS = {};

const FutabaParam = (param) => { return FUTABA_PARAMS[param] ?? 'Unspecified' };
window.lazyFunctions = {
    hideLoader: async function (element)
    {
        await anime({
            targets: '.loading-video',
            opacity: 0,
            duration: 600,
            complete: () => {
                document.querySelector('.loading-video').style.display = 'none';
            }
        });
    }
};

var lastUrlShortened = '';

var lazyLoadInstance = new LazyLoad({
    unobserve_entered: true,
    callback_enter: executeLazyFunction
});


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
                    
                    let userInfo = await fetch(`/api/session/info?key=${accessKey}`);
                    let userInfoJson = await userInfo.json();

                    if (!userInfoJson.data.success)
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

                    FUTABA_PARAMS.username = userInfoJson.data.user.displayName;
                    setCookie('auth.user.key', accessKey, 365);
                    SetScenario("WELCOME_USER");
                };
            }
        }
    },
    "WELCOME_USER": {
        "text": () => {
            return `<span class='vertical-align-middle'>Welcome&nbsp;back,&nbsp;${FutabaParam("username")}!</span>&nbsp;
<button class='speech-do-not-animate input-button align-right'>log out</button>
<br><br><br>
<input placeholder='URL' id='url-shorten'>&nbsp;<button class='input-button'>Shorten</button><br><br>
<input type="checkbox" id="shorten-destruct" name="destruct" />
<label for="destruct">Destruct link after use</label>` },
        "exec": {
            "after": async (dom) => {
                let urlToShorten = dom.querySelector('#url-shorten');
                let shortenButton = dom.querySelector('.input-button:nth-of-type(2)');
                let destroyableSelector = dom.querySelector('#shorten-destruct');

                // log out
                dom.querySelector('.input-button:nth-of-type(1)').addEventListener("click", async () => {
                    eraseCookie("auth.user.key");
                    window.location.reload();
                    return;
                });

                // shorten
                shortenButton.addEventListener("click", async () => {
                    urlToShorten.disabled = true;
                    shortenButton.disabled = true;
                    if (!isValidHttpUrl(urlToShorten.value) || lastUrlShortened == urlToShorten.value)
                    {
                        urlToShorten.disabled = false;
                        shortenButton.disabled = false;
                        return;    
                    }
                    let shortenReq = await fetch(`/api/link/shorten?key=${getCookie('auth.user.key')}&link=${urlToShorten.value}&onetime=${destroyableSelector.checked}&samedomain=true`);
                    let shortenReqJSON = await shortenReq.json();
                    urlToShorten.disabled = false;
                    shortenButton.disabled = false;
                    lastUrlShortened = `${shortenReqJSON.data.link}`;
                    urlToShorten.value = `${shortenReqJSON.data.link}`;
                    urlToShorten.focus();
                    urlToShorten.select();

                });
            }
        }
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
    lazyLoadInstance.update();
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
    if (getCookie("auth.user.key"))
    {
        let userAuth = await fetch('/api/session/info?key=' + getCookie('auth.user.key'));
        let userAuthJson = await userAuth.json();
        if (userAuthJson.status != 200)
        {
            eraseCookie('auth.user.key');
            window.location.reload();
            return;
        }
        FUTABA_PARAMS['username'] = userAuthJson.data.user.displayName;
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
                        await SetScenario('WELCOME_USER');
                    }
                });
            }
        });
        return;
    }
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

    if (FUTABA_SCENARIOS[scenarioName].text instanceof Function)
        await SpeakText(FUTABA_SCENARIOS[scenarioName].text(), DEFAULT_FUTABA_DELAY);
    else
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
            newAttr.innerHTML += text[l].innerText[lt] == ' ' ? '&nbsp;' : text[l].innerText[lt] ;
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

function executeLazyFunction(element) {
  var lazyFunctionName = element.getAttribute("data-lazy-function");
  var lazyFunction = window.lazyFunctions[lazyFunctionName];
  if (!lazyFunction) return;
  lazyFunction(element);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
