const surveyJSON = `[{
    "nameStartButton": "Старт",
    "nameNextButton": "Далее",
    "nameFinishButton": "Показать результаты",
    "questions": [
        {
            "id": 1,
            "quest": "How old are you?",
            "answerType": "radio",
            "answers": [
                {
                    "id": 5432,
                    "answer": "< 18"
                }, {
                    "id": 3428,
                    "answer": "> 18 and < 25"
                }, {
                    "id": 6754,
                    "answer": "> 25 and < 43"
                }, {
                    "id": 1953,
                    "answer": "> 43"
                }
            ]
        },
        {
            "id": 2,
            "quest": "What color are the eyes?",
            "answerType": "radio",
            "answers": [
                {
                    "id": 7863,
                    "answer": "Blue"
                }, {
                    "id": 5643,
                    "answer": "Green"
                }, {
                    "id": 6754,
                    "answer": "Hazel"
                }, {
                    "id": 8789,
                    "answer": "Red"
                }
            ]
        },
        {
            "id": 3,
            "quest": "Your education?",
            "answerType": "checkbox",
            "answers": [
                {
                    "id": 7863,
                    "answer": "Specialized secondary education"
                }, {
                    "id": 5643,
                    "answer": "Higher education"
                }, {
                    "id": 6754,
                    "answer": "General education"
                }
            ]
        },
        {
            "id": 4,
            "quest": "Your city of residence?",
            "answerType": "text"
        }
    ]
}]`;

class UserResult {
    constructor(name) {
        this._name = name;
        this.result = [];
    }

    getName() {
        return this._name;
    }
};

const Survey = JSON.parse(surveyJSON)[0];

const surveyStart = document.querySelector(".survey__start");
const btnStart = surveyStart.querySelector(".btn__start");
const nameUser = surveyStart.querySelector("#name__user");

const surveyForm = document.forms.surveyForm;
const questGeneral = document.querySelector(".quest__general");

let SurveyUser;

nameUser.addEventListener("input", () => {
    btnStart.hidden = true;
    if (nameUser.value.length > 1) btnStart.hidden = false;
});

btnStart.innerHTML = Survey.nameStartButton;
btnStart.addEventListener("click", () => {
    SurveyUser = "";
    SurveyUser = new UserResult(nameUser.value);
    nameUser.value = "";
    surveyStart.hidden = true;
    surveyForm.hidden = false;
    surveyForm.querySelector("h3").innerHTML = `Опрос проходит ${SurveyUser.getName()}`;
    showQuest();
});

function showQuest() {
    if (questGeneral.querySelector("p")) writeAnswer();

    questGeneral.innerHTML = "";
    questGeneral.id = +questGeneral.id + 1;

    if (questGeneral.id < Survey.questions.length) {
        surveyForm.btn.innerHTML = Survey.nameNextButton;
        surveyForm.btn.addEventListener("click", showQuest);
    }
    else {
        surveyForm.btn.innerHTML = Survey.nameFinishButton;
        surveyForm.btn.addEventListener("click", showResult);
    };

    const task = Survey.questions.find((elem) => {
        if (elem.id == questGeneral.id) return elem;
    });

    if (task) {
        const quest = document.createElement("p");
        quest.innerHTML = task.quest;
        questGeneral.append(quest);

        if (task.answerType == "radio" || task.answerType == "checkbox") {
            createInputRadioChekbox(task);
        }
        else if (task.answerType == "text") {
            createInputText(task);
        }
    }
}

function writeAnswer() {
    let AnswerQuest = {
        "quest": questGeneral.querySelector("p").innerHTML,
        "answers": [],
        "id_answers": [],
    }
    console.log(questGeneral.querySelector("p").innerHTML);
    surveyForm.querySelectorAll("input").forEach(elem => {
        if (elem.checked) {
            AnswerQuest.answers.push(elem.value);
            AnswerQuest.id_answers.push(elem.id);
        }
    });
    SurveyUser.result.push(AnswerQuest);
}

function createInputRadioChekbox(task) {
    task.answers.forEach(elem => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.marginBottom = "10px";

        const label = document.createElement("label");
        label.style.width = "70%";
        label.innerHTML = elem.answer;
        label.setAttribute("for", elem.id);

        const input = document.createElement("input");
        input.type = task.answerType;
        input.name = "quest";
        input.id = elem.id;
        input.value = elem.answer;

        div.append(label, input);
        questGeneral.append(div);
    });
};

function createInputText(task) {
    const input = document.createElement("input");
    input.type = task.answerType;
    input.id = "text";
    input.checked = true;
    input.style.width = "100%";
    input.style.marginBottom = "30px";

    questGeneral.append(input);
};

function showResult() {
    surveyForm.btn.hidden = true;
    surveyForm.btn.disabled = true;
    surveyForm.btn.removeEventListener("click", showResult);
    surveyForm.querySelector("h3").innerHTML = `Ознакомьтесь с результатами, ${SurveyUser.getName()}`;
    SurveyUser.result.forEach(elem => {
        const quest = document.createElement("p");
        quest.innerHTML = elem.quest;
        const answer = document.createElement("p");
        answer.innerHTML = elem.answers.join(", ");
        if (answer.innerHTML === "") answer.innerHTML = "none";

        questGeneral.append(quest, answer);
    });
    questGeneral.classList.add("result");

    const btnClose = document.querySelector(".btn__close");
    btnClose.hidden = false;
    btnClose.addEventListener("click", () => {
        btnClose.hidden = true;
        questGeneral.id = "0";
        questGeneral.classList.remove("result");
        surveyStart.hidden = false;
        surveyForm.hidden = true;
        surveyForm.btn.disabled = false;
        surveyForm.btn.hidden = false;
        questGeneral.innerHTML = ""
    });
};