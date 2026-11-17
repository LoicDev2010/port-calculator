'use strict';

const strokeInput = document.getElementById('stroke');
const rodLengthInput = document.getElementById('rodLength');
const boreInput = document.getElementById('bore');
const portsBody = document.getElementById('ports');
const addPortButton = document.getElementById('addPort');

const ports = [
    { name: 'Auslass', height: 28 },
    { name: 'Überströmer', height: 20 },
    { name: 'Einlass (Kolbenfenster)', height: 32 },
];

const readNumber = (input) => {
    const value = parseFloat(input.value);
    return Number.isFinite(value) ? value : 0;
};

function pistonPosition(thetaDeg, stroke, rodLength) {
    const r = stroke / 2;
    const thetaRad = thetaDeg * Math.PI / 180;
    const sinTheta = Math.sin(thetaRad);
    const term = Math.sqrt(rodLength * rodLength - r * r * sinTheta * sinTheta);
    return r + rodLength - (r * Math.cos(thetaRad) + term);
}

function findOpeningAngle(targetPosition, stroke, rodLength) {
    let lo = 0;
    let hi = 180;
    for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        if (pistonPosition(mid, stroke, rodLength) < targetPosition) lo = mid;
        else hi = mid;
    }
    return (lo + hi) / 2;
}

function calculate(portHeight) {
    const stroke = readNumber(strokeInput);
    const rodLength = readNumber(rodLengthInput);

    if (stroke <= 0 || rodLength <= 0 || portHeight <= 0 || portHeight >= stroke) {
        return null;
    }

    const openingAngle = findOpeningAngle(stroke - portHeight, stroke, rodLength);
    const bbdc = 180 - openingAngle;
    return { bbdc, abdc: bbdc, duration: 360 - 2 * openingAngle };
}

const fmt = (value) => value.toFixed(1);

function renderResult(row, port) {
    row.querySelectorAll('td.result').forEach((cell) => cell.remove());

    const timing = calculate(port.height);
    if (timing) {
        for (const text of [
            `${fmt(timing.bbdc)}° v. UT`,
            `${fmt(timing.abdc)}° n. UT`,
            `${fmt(timing.duration)}°`,
        ]) {
            const cell = document.createElement('td');
            cell.className = 'result';
            cell.textContent = text;
            row.appendChild(cell);
        }
    } else {
        const cell = document.createElement('td');
        cell.className = 'result text-muted';
        cell.colSpan = 3;
        cell.textContent = 'Eingabe unvollständig';
        row.appendChild(cell);
    }
}

function createRow(port) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.className = 'name';
    nameCell.textContent = port.name;

    const heightCell = document.createElement('td');
    heightCell.className = 'height';
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.1';
    input.min = '0';
    input.value = port.height;
    input.addEventListener('input', () => {
        port.height = readNumber(input);
        renderResult(row, port);
    });
    heightCell.appendChild(input);

    row.append(nameCell, heightCell);
    renderResult(row, port);
    return row;
}

// Rows are kept in place so the focused height input isn't lost while typing.
function renderAllResults() {
    [...portsBody.rows].forEach((row, i) => renderResult(row, ports[i]));
}

addPortButton.addEventListener('click', () => {
    const port = { name: `Kanal ${ports.length + 1}`, height: 0 };
    ports.push(port);
    portsBody.appendChild(createRow(port));
});

for (const input of [strokeInput, rodLengthInput, boreInput]) {
    input.addEventListener('input', renderAllResults);
}

ports.forEach((port) => portsBody.appendChild(createRow(port)));
