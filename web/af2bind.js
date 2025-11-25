// ============================================================================
// web/af2bind.js
// ============================================================================
// Standalone AF2BIND viewer application
// Combines essential utilities from app.js and utils.js
// Removes all MSA, PAE, ligand, and biounit code
// Self-contained: no dependencies on app.js or utils.js
// ============================================================================

// ============================================================================
// UTILITY FUNCTIONS (from utils.js) - CORE
// ============================================================================

// Compact MD5 implementation (replaces crypto-js dependency)
function md5(string) {
    function rotateLeft(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }
    function addUnsigned(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function cmn(q, a, b, x, s, t) {
        return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    const utf8Encode = s => unescape(encodeURIComponent(s));
    const s = utf8Encode(string);
    const l = s.length * 8;
    const x = Array(((l + 64) >>> 9 << 4) + 15).fill(0);

    for (let i = 0; i < l; i += 8) {
        x[i >> 5] |= (s.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    x[l >> 5] |= 0x80 << (l % 32);
    x[(((l + 64) >>> 9) << 4) + 14] = l;

    let [a, b, c, d] = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];

    for (let i = 0; i < x.length; i += 16) {
        const [olda, oldb, oldc, oldd] = [a, b, c, d];
        a = ff(a, b, c, d, x[i], 7, 0xD76AA478); d = ff(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
        c = ff(c, d, a, b, x[i + 2], 17, 0x242070DB); b = ff(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
        a = ff(a, b, c, d, x[i + 4], 7, 0xF57C0FAF); d = ff(d, a, b, c, x[i + 5], 12, 0x4787C62A);
        c = ff(c, d, a, b, x[i + 6], 17, 0xA8304613); b = ff(b, c, d, a, x[i + 7], 22, 0xFD469501);
        a = ff(a, b, c, d, x[i + 8], 7, 0x698098D8); d = ff(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
        c = ff(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1); b = ff(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
        a = ff(a, b, c, d, x[i + 12], 7, 0x6B901122); d = ff(d, a, b, c, x[i + 13], 12, 0xFD987193);
        c = ff(c, d, a, b, x[i + 14], 17, 0xA679438E); b = ff(b, c, d, a, x[i + 15], 22, 0x49B40821);
        a = gg(a, b, c, d, x[i + 1], 5, 0xF61E2562); d = gg(d, a, b, c, x[i + 6], 9, 0xC040B340);
        c = gg(c, d, a, b, x[i + 11], 14, 0x265E5A51); b = gg(b, c, d, a, x[i], 20, 0xE9B6C7AA);
        a = gg(a, b, c, d, x[i + 5], 5, 0xD62F105D); d = gg(d, a, b, c, x[i + 10], 9, 0x02441453);
        c = gg(c, d, a, b, x[i + 15], 14, 0xD8A1E681); b = gg(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
        a = gg(a, b, c, d, x[i + 9], 5, 0x21E1CDE6); d = gg(d, a, b, c, x[i + 14], 9, 0xC33707D6);
        c = gg(c, d, a, b, x[i + 3], 14, 0xF4D50D87); b = gg(b, c, d, a, x[i + 8], 20, 0x455A14ED);
        a = gg(a, b, c, d, x[i + 13], 5, 0xA9E3E905); d = gg(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
        c = gg(c, d, a, b, x[i + 7], 14, 0x676F02D9); b = gg(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);
        a = hh(a, b, c, d, x[i + 5], 4, 0xFFFA3942); d = hh(d, a, b, c, x[i + 8], 11, 0x8771F681);
        c = hh(c, d, a, b, x[i + 11], 16, 0x6D9D6122); b = hh(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
        a = hh(a, b, c, d, x[i + 1], 4, 0xA4BEEA44); d = hh(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
        c = hh(c, d, a, b, x[i + 7], 16, 0xF6BB4B60); b = hh(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
        a = hh(a, b, c, d, x[i + 13], 4, 0x289B7EC6); d = hh(d, a, b, c, x[i], 11, 0xEAA127FA);
        c = hh(c, d, a, b, x[i + 3], 16, 0xD4EF3085); b = hh(b, c, d, a, x[i + 6], 23, 0x04881D05);
        a = hh(a, b, c, d, x[i + 9], 4, 0xD9D4D039); d = hh(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
        c = hh(c, d, a, b, x[i + 15], 16, 0x1FA27CF8); b = hh(b, c, d, a, x[i + 2], 23, 0xC4AC5665);
        a = ii(a, b, c, d, x[i], 6, 0xF4292244); d = ii(d, a, b, c, x[i + 7], 10, 0x432AFF97);
        c = ii(c, d, a, b, x[i + 14], 15, 0xAB9423A7); b = ii(b, c, d, a, x[i + 5], 21, 0xFC93A039);
        a = ii(a, b, c, d, x[i + 12], 6, 0x655B59C3); d = ii(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
        c = ii(c, d, a, b, x[i + 10], 15, 0xFFEFF47D); b = ii(b, c, d, a, x[i + 1], 21, 0x85845DD1);
        a = ii(a, b, c, d, x[i + 8], 6, 0x6FA87E4F); d = ii(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
        c = ii(c, d, a, b, x[i + 6], 15, 0xA3014314); b = ii(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
        a = ii(a, b, c, d, x[i + 4], 6, 0xF7537E82); d = ii(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
        c = ii(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB); b = ii(b, c, d, a, x[i + 9], 21, 0xEB86D391);
        a = addUnsigned(a, olda); b = addUnsigned(b, oldb);
        c = addUnsigned(c, oldc); d = addUnsigned(d, oldd);
    }

    const toHex = n => {
        let s = '';
        for (let i = 0; i < 4; i++) s += ((n >> (i * 8)) & 0xFF).toString(16).padStart(2, '0');
        return s;
    };
    return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

function calculateMean(coords) {
    let sum = [0, 0, 0];
    for (const c of coords) {
        sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2];
    }
    return [sum[0] / coords.length, sum[1] / coords.length, sum[2] / coords.length];
}

function kabsch(A, B) {
    const H = numeric.dot(numeric.transpose(A), B);
    const svd = numeric.svd(H);
    const U = svd.U; const V = svd.V; const Vt = numeric.transpose(V);
    let D = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    if (numeric.det(numeric.dot(U, Vt)) < 0) D[2][2] = -1;
    return numeric.dot(U, numeric.dot(D, Vt));
}

function align_a_to_b(fullCoordsA, alignCoordsA, alignCoordsB) {
    const meanAlignA = calculateMean(alignCoordsA);
    const meanAlignB = calculateMean(alignCoordsB);
    const centAlignA = alignCoordsA.map(c => [c[0] - meanAlignA[0], c[1] - meanAlignA[1], c[2] - meanAlignA[2]]);
    const centAlignB = alignCoordsB.map(c => [c[0] - meanAlignB[0], c[1] - meanAlignB[1], c[2] - meanAlignB[2]]);
    const R = kabsch(centAlignA, centAlignB);
    const centFullA = fullCoordsA.map(c => [c[0] - meanAlignA[0], c[1] - meanAlignA[1], c[2] - meanAlignA[2]]);
    const rotatedFullA = numeric.dot(centFullA, R);
    return rotatedFullA.map(c => [c[0] + meanAlignB[0], c[1] + meanAlignB[1], c[2] + meanAlignB[2]]);
}

function mean3(coords) {
    const m = [0, 0, 0];
    for (const c of coords) { m[0] += c[0]; m[1] += c[1]; m[2] += c[2]; }
    m[0] /= coords.length; m[1] /= coords.length; m[2] /= coords.length;
    return m;
}

function covarianceXXT(coords) {
    const mu = mean3(coords);
    const X = coords.map(c => [c[0] - mu[0], c[1] - mu[1], c[2] - mu[2]]);
    return numeric.dot(numeric.transpose(X), X);
}

function ensureRightHand(V) {
    const det = numeric.det(V);
    if (det < 0) V = V.map(r => [r[0], r[1], -r[2]]);
    return V;
}

function trace(M) { return M[0][0] + M[1][1] + M[2][2]; }

function bestViewTargetRotation_relaxed_AUTO(coords, currentRotation) {
    if (!coords || coords.length < 2) return currentRotation || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    const firstCoord = coords[0];
    let allSame = coords.every(c => Math.abs(c[0] - firstCoord[0]) < 1e-10 && Math.abs(c[1] - firstCoord[1]) < 1e-10 && Math.abs(c[2] - firstCoord[2]) < 1e-10);
    if (allSame) return currentRotation || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    const cov = covarianceXXT(coords);
    const eig = numeric.eig(cov);
    let V = eig.E.x;
    V = ensureRightHand(V);

    const longAxis = [cov[0][0], cov[1][1], cov[2][2]].indexOf(Math.max(cov[0][0], cov[1][1], cov[2][2]));
    const vLong = [V[0][longAxis], V[1][longAxis], V[2][longAxis]];
    const target_long_in_view = [0, 0, 1];

    const vLong_mag = Math.sqrt(vLong[0] * vLong[0] + vLong[1] * vLong[1] + vLong[2] * vLong[2]);
    const vLong_norm = [vLong[0] / vLong_mag, vLong[1] / vLong_mag, vLong[2] / vLong_mag];
    const dot_long = vLong_norm[0] * target_long_in_view[0] + vLong_norm[1] * target_long_in_view[1] + vLong_norm[2] * target_long_in_view[2];

    if (Math.abs(Math.abs(dot_long) - 1) < 0.01) return currentRotation || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    const axis = [vLong_norm[1] * target_long_in_view[2] - vLong_norm[2] * target_long_in_view[1],
                  vLong_norm[2] * target_long_in_view[0] - vLong_norm[0] * target_long_in_view[2],
                  vLong_norm[0] * target_long_in_view[1] - vLong_norm[1] * target_long_in_view[0]];
    const axis_mag = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    if (axis_mag < 1e-10) return currentRotation || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    const axis_norm = [axis[0] / axis_mag, axis[1] / axis_mag, axis[2] / axis_mag];
    const angle = Math.acos(Math.max(-1, Math.min(1, dot_long)));
    const c = Math.cos(angle), s = Math.sin(angle);
    const K = [[0, -axis_norm[2], axis_norm[1]], [axis_norm[2], 0, -axis_norm[0]], [-axis_norm[1], axis_norm[0], 0]];
    const K2 = numeric.dot(K, K);
    const R = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            R[i][j] = R[i][j] + s * K[i][j] + (1 - c) * K2[i][j];
        }
    }
    return R;
}

// ============================================================================
// PDB PARSING (from utils.js)
// ============================================================================

function parsePDB(text) {
    const lines = text.split('\n');
    const models = [];
    let currentModelAtoms = [];
    const modresMap = {};
    const conectMap = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const recordName = line.substring(0, 6).trim();

        if (recordName === 'ATOM' || recordName === 'HETATM') {
            const serial = parseInt(line.substring(6, 11));
            const atomName = line.substring(12, 16).trim();
            const altLoc = line.substring(16, 17);
            if (altLoc !== ' ' && altLoc !== 'A') continue;
            const resName = line.substring(17, 20).trim();
            const chain = line.substring(21, 22);
            const resSeq = parseInt(line.substring(22, 26));
            const x = parseFloat(line.substring(30, 38));
            const y = parseFloat(line.substring(38, 46));
            const z = parseFloat(line.substring(46, 54));
            const b = parseFloat(line.substring(60, 66)) || 0;

            currentModelAtoms.push({ serial, atomName, resName, chain, resSeq, x, y, z, b });
        } else if (recordName === 'ENDMDL') {
            if (currentModelAtoms.length > 0) {
                models.push([...currentModelAtoms]);
                currentModelAtoms = [];
            }
        } else if (recordName === 'MODRES') {
            const resName = line.substring(12, 15).trim();
            const modifiedResidue = line.substring(24, 27).trim();
            modresMap[resName] = modifiedResidue;
        } else if (recordName === 'CONECT') {
            const serial = parseInt(line.substring(6, 11));
            const connected = [];
            for (let j = 11; j < 70; j += 5) {
                const connectedSerial = parseInt(line.substring(j, j + 5));
                if (!isNaN(connectedSerial)) connected.push(connectedSerial);
            }
            conectMap[serial] = connected;
        }
    }

    if (currentModelAtoms.length > 0) models.push(currentModelAtoms);
    return { models, modresMap, conectMap };
}

function isRealAminoAcid(resName) {
    const stdAminoAcids = ['ALA', 'ARG', 'ASN', 'ASP', 'CYS', 'GLN', 'GLU', 'GLY', 'HIS', 'ILE', 'LEU', 'LYS', 'MET', 'PHE', 'PRO', 'SER', 'THR', 'TRP', 'TYR', 'VAL'];
    return stdAminoAcids.includes(resName.toUpperCase());
}

function isRealNucleicAcid(resName) {
    const nucs = ['DA', 'DC', 'DG', 'DT', 'A', 'C', 'G', 'U'];
    return nucs.includes(resName.toUpperCase());
}

function normalizePlddt(b) {
    if (b < 0) b = 0;
    if (b > 100) b = 100;
    return b;
}

function convertParsedToFrameData(atoms, modresMap) {
    const frame = { coords: [], chains: [], position_types: [], position_names: [], residue_numbers: [], plddts: [] };

    for (const atom of atoms) {
        const isCA = atom.atomName === 'CA' || atom.atomName === 'C4\'';
        if (!isCA) continue;

        frame.coords.push([atom.x, atom.y, atom.z]);
        frame.chains.push(atom.chain || 'A');
        frame.residue_numbers.push(atom.resSeq);

        let posType = 'P';
        if (isRealNucleicAcid(atom.resName)) posType = atom.atomName === 'C4\'' ? 'R' : 'D';
        frame.position_types.push(posType);

        frame.position_names.push(atom.resName);
        frame.plddts.push(normalizePlddt(atom.b));
    }

    return frame;
}

// ============================================================================
// GLOBAL STATE
// ============================================================================

let viewerApi = null;
const bindingSiteCache = {};
const atomIndexMap = {}; // Maps objectName -> [{ chain, resiNum }, ...] for efficient lookup
const pdbDataCache = {}; // Store original PDB data for download functionality

class ProteomeLookup {
    constructor() { this.index = null; this.loaded = false; this.reverseIndex = null; }
    load() {
        if (!window.EMBEDDED_PROTEOME_DATA) {
            console.error('Embedded proteome data not found');
            return;
        }

        // Convert compact array format [uniprot, swissprot, md5] to object format
        this.index = {};
        for (const [uniprot, swissprot, md5] of window.EMBEDDED_PROTEOME_DATA) {
            this.index[uniprot] = { swissprot, md5 };
        }

        // Build reverse index for swissprot and md5 lookups
        this.reverseIndex = { swissprot: {}, md5: {} };
        for (const [uniprotId, data] of Object.entries(this.index)) {
            if (data.swissprot) {
                this.reverseIndex.swissprot[data.swissprot.toUpperCase()] = uniprotId;
            }
            if (data.md5) {
                this.reverseIndex.md5[data.md5.toLowerCase()] = uniprotId;
            }
        }

        this.loaded = true;
        console.log(`✓ Proteome index loaded: ${Object.keys(this.index).length} proteins`);
    }
    search(query) {
        if (!this.loaded || !this.index) return null;
        const normalized = query.trim().toUpperCase();

        // Try direct UniProt ID lookup
        if (this.index[normalized]) {
            return { uniprot: normalized, ...this.index[normalized] };
        }

        // Try SwissProt ID lookup
        if (this.reverseIndex.swissprot[normalized]) {
            const uniprotId = this.reverseIndex.swissprot[normalized];
            return { uniprot: uniprotId, ...this.index[uniprotId] };
        }

        // Try MD5 lookup (if input looks like MD5 hash - 32 hex chars)
        if (/^[a-f0-9]{32}$/i.test(normalized)) {
            const md5Lower = normalized.toLowerCase();
            if (this.reverseIndex.md5[md5Lower]) {
                const uniprotId = this.reverseIndex.md5[md5Lower];
                return { uniprot: uniprotId, ...this.index[uniprotId] };
            }
        }

        // Try to compute MD5 of input (if it's a sequence)
        const cleaned = normalized.replace(/[\s\d]/g, '').toUpperCase();
        if (/^[ACDEFGHIKLMNPQRSTUVWXYOBZJ]+$/.test(cleaned)) {
            const hash = md5(cleaned);
            if (this.reverseIndex.md5[hash]) {
                const uniprotId = this.reverseIndex.md5[hash];
                return { uniprot: uniprotId, ...this.index[uniprotId] };
            }
        }

        return null;
    }
}

const proteomeLookup = new ProteomeLookup();

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Register custom "pbind" color mode BEFORE initializing viewer
    if (window.registerCustomColorMode) {
        registerCustomColorMode('pbind', bindingSiteColorFunc);
    }

    // Initialize global viewer config (must be on window object)
    window.viewerConfig = {
        viewer_id: 'af2bind-viewer',
        display: { size: [600, 600], rotate: false, autoplay: false, controls: true, box: true },
        rendering: { width: 3.0, ortho: 1.0, pastel: 0.25 },
        color: { mode: "pbind" }
    };

    // Setup canvas
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.width = '600px';
        canvas.style.height = '600px';
    }

    // Initialize viewer
    try {
        const viewerContainer = document.getElementById('viewer-container');
        if (viewerContainer) {
            initializePy2DmolViewer(viewerContainer);
            viewerApi = window.py2dmol_viewers[window.viewerConfig.viewer_id];
            console.log('✓ Viewer initialized');
        }
    } catch (e) {
        console.error("Failed to initialize viewer:", e);
        setStatus("Error: Failed to initialize viewer", true);
        return;
    }

    // Setup sequence viewer
    if (window.SequenceViewer && window.SequenceViewer.setCallbacks) {
        window.SequenceViewer.setCallbacks({
            getRenderer: () => viewerApi?.renderer || null,
            getObjectSelect: () => document.getElementById('objectSelect'),
            toggleChainResidues: (chainId) => {
                if (!viewerApi?.renderer) return;
                const renderer = viewerApi.renderer;
                const current = renderer.getSelection?.() || {};
                const isChainSelected = current?.chains?.has(chainId) || false;

                const newChains = new Set(current?.chains || []);
                if (isChainSelected) {
                    newChains.delete(chainId);
                } else {
                    newChains.add(chainId);
                }

                renderer.setSelection({ chains: newChains });
            },
            setChainResiduesSelected: (chainId, selected) => {
                if (!viewerApi?.renderer) return;
                const renderer = viewerApi.renderer;
                const current = renderer.getSelection?.() || {};

                const newChains = new Set(current?.chains || []);
                if (selected) {
                    newChains.add(chainId);
                } else {
                    newChains.delete(chainId);
                }

                renderer.setSelection({ chains: newChains });
            },
            highlightAtom: (positionIndex) => {
                if (viewerApi?.renderer) {
                    viewerApi.renderer.highlightedAtom = positionIndex;
                    viewerApi.renderer.highlightedAtoms = null;
                    viewerApi.renderer.render('sequence: highlight atom');
                }
            },
            highlightAtoms: (positionIndices) => {
                if (viewerApi?.renderer) {
                    viewerApi.renderer.highlightedAtom = null;
                    viewerApi.renderer.highlightedAtoms = positionIndices instanceof Set ? positionIndices : new Set(positionIndices);
                    viewerApi.renderer.render('sequence: highlight atoms');
                }
            },
            clearHighlight: () => {
                if (viewerApi?.renderer) {
                    viewerApi.renderer.highlightedAtom = null;
                    viewerApi.renderer.highlightedAtoms = null;
                    viewerApi.renderer.render('sequence: clear highlight');
                }
            },
            applySelection: () => {}
        });
        if (viewerApi?.renderer?.canvas) window.SequenceViewer.drawHighlights();
    }

    // Setup events
    setupEventListeners();

    // Load embedded proteome data
    proteomeLookup.load();
    const count = proteomeLookup.index ? Object.keys(proteomeLookup.index).length : 0;
    setStatus(`Ready. ${count} proteins with AF2BIND predictions available.`);
}

function setStatus(message, isError = false) {
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? '#dc2626' : '#374151';
    }
    console.log((isError ? '✗' : '✓') + ' ' + message);
}

function loadRandomProtein() {
    if (!proteomeLookup.index || Object.keys(proteomeLookup.index).length === 0) {
        return;
    }

    // All proteins in the index have AF2BIND predictions
    const allProteins = Object.keys(proteomeLookup.index);
    const randomProtein = allProteins[Math.floor(Math.random() * allProteins.length)];

    const fetchInput = document.getElementById('fetch-uniprot-id');
    if (fetchInput) {
        fetchInput.value = randomProtein;
    }
    handleFetch();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    const fetchBtn = document.getElementById('fetch-btn');
    const fetchInput = document.getElementById('fetch-uniprot-id');
    const luckyBtn = document.getElementById('lucky-btn');
    const colorSelect = document.getElementById('colorSelect');
    const objectSelect = document.getElementById('objectSelect');
    const sequenceModeSelect = document.getElementById('sequenceModeSelect');
    const clearAllBtn = document.getElementById('clearAllButton');

    if (fetchBtn && fetchInput) {
        fetchBtn.addEventListener('click', handleFetch);
        fetchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleFetch(); });
    }

    if (luckyBtn) {
        luckyBtn.addEventListener('click', loadRandomProtein);
    }

    if (colorSelect) colorSelect.addEventListener('change', handleColorChange);
    if (objectSelect) objectSelect.addEventListener('change', handleObjectChange);
    if (sequenceModeSelect) {
        sequenceModeSelect.addEventListener('change', (e) => {
            const isSequenceMode = e.target.value === 'sequence';
            if (window.SequenceViewer?.setSequenceViewMode) {
                window.SequenceViewer.setSequenceViewMode(isSequenceMode);
            }
            if (window.SequenceViewer?.buildSequenceView) {
                window.SequenceViewer.buildSequenceView();
            }
        });
    }
    if (clearAllBtn) clearAllBtn.addEventListener('click', handleClearAll);
}

// ============================================================================
// FETCH & STRUCTURE LOADING
// ============================================================================

async function handleFetch() {
    const input = document.getElementById('fetch-uniprot-id')?.value.trim().toUpperCase();
    if (!input) {
        setStatus('Please enter a UniProt ID', true);
        return;
    }

    let uniprotId = input;
    if (proteomeLookup.loaded) {
        const result = proteomeLookup.search(input);
        if (result) uniprotId = result.uniprot;
    }

    // Check if protein is already loaded
    if (viewerApi?.renderer?.objectsData && uniprotId in viewerApi.renderer.objectsData) {
        setStatus(`${uniprotId} already loaded. Select from the Protein menu.`, true);
        return;
    }

    try {
        const url = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v6.pdb`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Protein not found (HTTP ${response.status})`);

        const pdbData = await response.text();
        const parsed = parsePDB(pdbData);
        if (!parsed.models || parsed.models.length === 0) throw new Error('No structure data found');

        // Store original PDB data for download functionality
        pdbDataCache[uniprotId] = pdbData;

        // Load binding predictions BEFORE displaying structure so colors are available
        await loadBindingSitePredictions(uniprotId);
        loadStructure(parsed, uniprotId);
        setStatus(`Loaded ${uniprotId} successfully`);

    } catch (error) {
        console.error('Fetch error:', error);
        setStatus(`Error: ${error.message}`, true);
    }
}

function loadStructure(parsed, objectName) {
    if (!viewerApi?.renderer) {
        setStatus("Viewer not initialized", true);
        return;
    }

    const renderer = viewerApi.renderer;
    const container = document.getElementById('viewer-container');
    if (container) container.style.display = 'block';

    // Show sequence viewer container
    const sequenceContainer = document.getElementById('sequence-viewer-container');
    if (sequenceContainer) sequenceContainer.style.display = 'block';

    const frames = [];
    for (const atoms of parsed.models) {
        const frame = convertParsedToFrameData(atoms, parsed.modresMap);
        if (frame.coords.length > 0) frames.push(frame);
    }

    if (frames.length === 0) {
        setStatus("No CA atoms found", true);
        return;
    }

    // Store atom index mapping for color function lookup
    // Use first frame to build mapping (all frames have same atom order)
    atomIndexMap[objectName] = frames[0].chains.map((chain, i) => ({
        chain: chain,
        resiNum: frames[0].residue_numbers[i]
    }));

    // Preserve current color mode before adding new object
    const colorSelect = document.getElementById('colorSelect');
    const preservedColorMode = colorSelect?.value;

    renderer.addObject(objectName);
    for (const frame of frames) renderer.addFrame(frame, objectName);
    renderer.currentObjectName = objectName;
    renderer.render('af2bind: structure loaded');

    // Restore color mode after render
    if (colorSelect && preservedColorMode) {
        colorSelect.value = preservedColorMode;
        renderer.colorMode = preservedColorMode;
    }

    updateObjectSelect();
    updateFrameUI();

    // Show sequence view and build it
    const sequenceView = document.getElementById('sequenceView');
    if (sequenceView) sequenceView.classList.remove('hidden');
    if (window.SequenceViewer?.buildSequenceView) window.SequenceViewer.buildSequenceView();

    // Render binding results table if predictions are available
    renderBindingSiteResults(objectName);

    console.log(`✓ Loaded ${frames.length} frames with ${frames[0].coords.length} atoms`);
}

function renderBindingSiteResults(objectName) {
    const container = document.getElementById('binding-results-container');
    const tableDiv = document.getElementById('bindingResultsTable');
    if (!container || !tableDiv || !viewerApi?.renderer) {
        console.log('renderBindingSiteResults: missing elements', { container, tableDiv, viewerApi });
        return;
    }

    const predictions = bindingSiteCache[objectName];
    console.log('renderBindingSiteResults:', { objectName, predictions, bindingSiteCache });
    if (!predictions || !predictions.scoreMap) {
        console.log('No predictions found for', objectName);
        container.style.display = 'none';
        return;
    }

    const atomInfo = atomIndexMap[objectName];
    if (!atomInfo) {
        console.log('No atom info found for', objectName);
        container.style.display = 'none';
        return;
    }
    console.log('renderBindingSiteResults: proceeding with', objectName, 'predictions:', Object.keys(predictions.scoreMap).length);

    // Get amino acid names from first frame
    const renderer = viewerApi.renderer;
    const objData = renderer.objectsData[objectName];
    const positionNames = objData?.frames?.[0]?.position_names || [];

    // Collect all residues with their binding scores
    const residues = [];
    for (let i = 0; i < atomInfo.length; i++) {
        const chain = atomInfo[i].chain;
        const resiNum = atomInfo[i].resiNum;
        const key = `${chain},${resiNum}`;
        const score = predictions.scoreMap[key];

        if (score !== undefined) {
            // Get amino acid name (3-letter code) and convert to 1-letter
            const aaName = positionNames[i] || '?';
            const aa = aaName.length === 3 ? threeLetterToOne(aaName) : aaName;

            residues.push({
                pos: resiNum,
                aa: aa,
                pbind: score,
                atomIndex: i,
                chain: chain
            });
        }
    }

    // Sort by binding score (descending)
    residues.sort((a, b) => b.pbind - a.pbind);

    // Add download buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.marginTop = '8px';

    // PDB download button
    const pdbBtn = document.createElement('button');
    pdbBtn.className = 'btn btn-grey btn-small';
    pdbBtn.style.flex = '1';
    pdbBtn.style.textAlign = 'center';
    pdbBtn.innerHTML = '<i class="fa-solid fa-download" style="margin-right: 6px;"></i>Download PDB';
    pdbBtn.onclick = () => downloadPDB(objectName);

    // CSV download button
    const csvBtn = document.createElement('button');
    csvBtn.className = 'btn btn-grey btn-small';
    csvBtn.style.flex = '1';
    csvBtn.style.textAlign = 'center';
    csvBtn.innerHTML = '<i class="fa-solid fa-download" style="margin-right: 6px;"></i>Download CSV';
    csvBtn.onclick = () => downloadCSV(objectName);

    buttonContainer.appendChild(pdbBtn);
    buttonContainer.appendChild(csvBtn);
    tableDiv.appendChild(buttonContainer);

    // Show container first so it's laid out and we can measure its width
    container.style.display = 'block';

    // Clear old canvas to get accurate container width measurement
    tableDiv.innerHTML = '';

    // Get actual container width to match control panel
    const containerWidth = container.offsetWidth;
    const tableWidth = Math.max(200, containerWidth - 24); // Subtract padding (12px on each side)

    // Re-create canvas element
    canvasElement = document.createElement('canvas');
    canvasElement.id = 'bindingResultsCanvas';
    canvasElement.style.display = 'block';
    canvasElement.style.border = '1px solid #d1d5db';
    canvasElement.style.marginBottom = '8px';
    tableDiv.appendChild(canvasElement);

    // Re-add download buttons
    const newButtonContainer = document.createElement('div');
    newButtonContainer.style.display = 'flex';
    newButtonContainer.style.gap = '8px';
    newButtonContainer.style.marginTop = '8px';

    // PDB download button
    const newPdbBtn = document.createElement('button');
    newPdbBtn.className = 'btn btn-grey btn-small';
    newPdbBtn.style.flex = '1';
    newPdbBtn.style.textAlign = 'center';
    newPdbBtn.innerHTML = '<i class="fa-solid fa-download" style="margin-right: 6px;"></i>Download PDB';
    newPdbBtn.onclick = () => downloadPDB(objectName);

    // CSV download button
    const newCsvBtn = document.createElement('button');
    newCsvBtn.className = 'btn btn-grey btn-small';
    newCsvBtn.style.flex = '1';
    newCsvBtn.style.textAlign = 'center';
    newCsvBtn.innerHTML = '<i class="fa-solid fa-download" style="margin-right: 6px;"></i>Download CSV';
    newCsvBtn.onclick = () => downloadCSV(objectName);

    newButtonContainer.appendChild(newPdbBtn);
    newButtonContainer.appendChild(newCsvBtn);
    tableDiv.appendChild(newButtonContainer);

    // Render canvas table with dynamic width matching the control panel
    renderBindingSiteTable(canvasElement, residues, tableWidth, 400);
}

// ============================================================================
// Binding Site Results Table Renderer
// ============================================================================
// Constants
const BINDING_TABLE_CONSTANTS = {
    headerHeight: 24,
    rowHeight: 24,
    scrollbarWidth: 15,
    scrollbarPadding: 2,
    scrollbarTrackColor: '#f0f0f0',
    scrollbarThumbColor: '#b0b0b0',
    scrollbarThumbMinHeight: 20,
    // Column positions (pixels from left)
    colPosStart: 8,
    colAaStart: 68,
    colPbindStart: 128,
    colPbindWidth: 36
};

// Scroll state (per canvas)
let bindingTableScrollState = {};

function renderBindingSiteTable(canvas, residues, maxWidth, maxHeight) {
    if (!canvas || !residues || residues.length === 0) return;

    // High-DPI rendering: render at 200 DPI internally, display at logical size
    const targetDPI = 200;
    const standardDPI = 96;
    const dpiMultiplier = targetDPI / standardDPI;

    const logicalWidth = maxWidth;
    const logicalHeight = maxHeight;
    const { headerHeight, rowHeight, scrollbarWidth, scrollbarPadding, colPosStart, colAaStart, colPbindStart, colPbindWidth } = BINDING_TABLE_CONSTANTS;

    // Set canvas internal resolution for crisp rendering (larger than display size)
    canvas.width = logicalWidth * dpiMultiplier;
    canvas.height = logicalHeight * dpiMultiplier;

    // Set display size to logical dimensions
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpiMultiplier, dpiMultiplier);

    // Get or initialize scroll state for this canvas
    const canvasId = canvas.id || 'default';
    if (!(canvasId in bindingTableScrollState)) {
        bindingTableScrollState[canvasId] = 0;
    }
    let scrollTop = bindingTableScrollState[canvasId];

    // Calculate scrollable area
    const fullContentHeight = residues.length * rowHeight;
    const scrollableAreaHeight = logicalHeight - headerHeight;
    const maxScrollTop = Math.max(0, fullContentHeight - scrollableAreaHeight);
    scrollTop = Math.max(0, Math.min(maxScrollTop, scrollTop));
    bindingTableScrollState[canvasId] = scrollTop;

    // Content area (excluding scrollbar)
    const contentWidth = logicalWidth - scrollbarWidth;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Calculate visible rows
    const startRow = Math.floor(scrollTop / rowHeight);
    const endRow = Math.ceil((scrollTop + scrollableAreaHeight) / rowHeight);

    // Draw rows
    for (let i = startRow; i < Math.min(endRow, residues.length); i++) {
        const res = residues[i];
        const y = headerHeight + i * rowHeight - scrollTop;

        // Draw row background
        ctx.fillStyle = i % 2 === 0 ? '#fafafa' : '#ffffff';
        ctx.fillRect(0, y, contentWidth, rowHeight);

        // Draw row border
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + rowHeight);
        ctx.lineTo(contentWidth, y + rowHeight);
        ctx.stroke();

        // Draw position
        ctx.fillStyle = '#000000';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(res.pos, colPosStart, y + rowHeight / 2);

        // Draw amino acid
        ctx.fillText(res.aa, colAaStart, y + rowHeight / 2);

        // Draw pBind color box
        const color = getBindingColor(res.pbind);
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
        ctx.fillRect(colPbindStart, y + 4, colPbindWidth, 16);

        // Draw pBind score text with inverted colors for readability
        // Calculate luminance of background color
        const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
        // Use white text on dark backgrounds, black text on light backgrounds
        ctx.fillStyle = luminance > 0.5 ? '#000000' : '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(res.pbind.toFixed(2), colPbindStart + colPbindWidth / 2, y + 12);
    }

    // Draw scrollbar
    if (maxScrollTop > 0) {
        const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
        const thumbHeight = Math.max(BINDING_TABLE_CONSTANTS.scrollbarThumbMinHeight, (scrollableAreaHeight / fullContentHeight) * scrollableAreaHeight);
        const thumbY = scrollRatio * (scrollableAreaHeight - thumbHeight);
        const vScrollbarX = contentWidth;

        // Track
        ctx.fillStyle = BINDING_TABLE_CONSTANTS.scrollbarTrackColor;
        ctx.fillRect(vScrollbarX, headerHeight, scrollbarWidth, scrollableAreaHeight);

        // Thumb
        ctx.fillStyle = BINDING_TABLE_CONSTANTS.scrollbarThumbColor;
        ctx.fillRect(vScrollbarX + scrollbarPadding, headerHeight + thumbY, scrollbarWidth - scrollbarPadding * 2, thumbHeight);
    }

    // Draw sticky header (last so it appears on top)
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, contentWidth, headerHeight);
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Pos', colPosStart, headerHeight / 2);
    ctx.fillText('AA', colAaStart, headerHeight / 2);
    ctx.fillText('pBind', colPbindStart, headerHeight / 2);

    // Header border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, headerHeight);
    ctx.lineTo(contentWidth, headerHeight);
    ctx.stroke();

    // Attach event handlers
    attachBindingTableEvents(canvas, residues, logicalWidth, logicalHeight, canvasId);
}

function attachBindingTableEvents(canvas, residues, logicalWidth, logicalHeight, canvasId) {
    const { headerHeight, rowHeight, scrollbarWidth, colPbindStart, colPbindWidth } = BINDING_TABLE_CONSTANTS;
    const contentWidth = logicalWidth - scrollbarWidth;
    const scrollableAreaHeight = logicalHeight - headerHeight;

    // Remove old listeners
    canvas.onwheel = null;
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseleave = null;

    // Wheel scroll
    canvas.onwheel = (e) => {
        e.preventDefault();
        const fullContentHeight = residues.length * rowHeight;
        const maxScrollTop = Math.max(0, fullContentHeight - scrollableAreaHeight);
        bindingTableScrollState[canvasId] = Math.max(0, Math.min(maxScrollTop, bindingTableScrollState[canvasId] + e.deltaY * 0.5));
        renderBindingSiteTable(canvas, residues, logicalWidth, logicalHeight);
    };

    // Scrollbar and row interactions
    canvas.onmousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (logicalWidth / rect.width);
        const y = (e.clientY - rect.top) * (logicalHeight / rect.height);

        const fullContentHeight = residues.length * rowHeight;
        const maxScrollTop = Math.max(0, fullContentHeight - scrollableAreaHeight);
        const vScrollbarX = contentWidth;

        // Calculate scrollbar thumb position
        const scrollRatio = maxScrollTop > 0 ? bindingTableScrollState[canvasId] / maxScrollTop : 0;
        const thumbHeight = Math.max(BINDING_TABLE_CONSTANTS.scrollbarThumbMinHeight, (scrollableAreaHeight / fullContentHeight) * scrollableAreaHeight);
        const thumbY = scrollRatio * (scrollableAreaHeight - thumbHeight);

        // Check if clicking on scrollbar
        if (x >= vScrollbarX && y >= headerHeight) {
            const clickY = y - headerHeight;

            if (clickY >= thumbY && clickY <= thumbY + thumbHeight) {
                // Dragging thumb
                const startY = clickY;
                const startScroll = bindingTableScrollState[canvasId];

                const mousemove = (moveEvent) => {
                    const newY = (moveEvent.clientY - rect.top) * (logicalHeight / rect.height) - headerHeight;
                    const deltaY = newY - startY;
                    const newScroll = startScroll + (deltaY / (scrollableAreaHeight - thumbHeight)) * maxScrollTop;
                    bindingTableScrollState[canvasId] = Math.max(0, Math.min(newScroll, maxScrollTop));
                    renderBindingSiteTable(canvas, residues, logicalWidth, logicalHeight);
                };

                const mouseup = () => {
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                };

                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);
            } else {
                // Click on track
                const increment = clickY < thumbY ? -rowHeight * 5 : rowHeight * 5;
                bindingTableScrollState[canvasId] = Math.max(0, Math.min(maxScrollTop, bindingTableScrollState[canvasId] + increment));
                renderBindingSiteTable(canvas, residues, logicalWidth, logicalHeight);
            }
        }
    };

    // Hover for highlighting
    canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (logicalWidth / rect.width);
        const y = (e.clientY - rect.top) * (logicalHeight / rect.height);
        const rowIndex = Math.floor((y - headerHeight + bindingTableScrollState[canvasId]) / rowHeight);

        if (rowIndex >= 0 && rowIndex < residues.length && x < contentWidth) {
            const res = residues[rowIndex];
            if (viewerApi?.renderer) {
                viewerApi.renderer.highlightedAtom = res.atomIndex;
                viewerApi.renderer.highlightedAtoms = null;
                viewerApi.renderer.render('highlight atom');
            }
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    };

    canvas.onmouseleave = () => {
        if (viewerApi?.renderer) {
            viewerApi.renderer.highlightedAtom = null;
            viewerApi.renderer.highlightedAtoms = null;
            viewerApi.renderer.render('clear highlight');
        }
        canvas.style.cursor = 'default';
    };
}

function threeLetterToOne(threeCode) {
    const code = threeCode?.toUpperCase().trim() || '?';
    const map = {
        'ALA': 'A', 'ARG': 'R', 'ASN': 'N', 'ASP': 'D', 'CYS': 'C',
        'GLU': 'E', 'GLN': 'Q', 'GLY': 'G', 'HIS': 'H', 'ILE': 'I',
        'LEU': 'L', 'LYS': 'K', 'MET': 'M', 'PHE': 'F', 'PRO': 'P',
        'SER': 'S', 'THR': 'T', 'TRP': 'W', 'TYR': 'Y', 'VAL': 'V',
        'ASX': 'B', 'GLX': 'Z', 'XLE': 'J', 'SEC': 'U', 'PYL': 'O', 'XAA': 'X'
    };
    return map[code] || '?';
}

function getBindingColor(score) {
    // White (0) → Blue (1.0)
    const t = score; // 0-1 for entire range
    return {
        r: Math.round(255 * (1 - t)),
        g: Math.round(255 * (1 - t)),
        b: 255
    };
}

function updateObjectSelect() {
    if (!viewerApi?.renderer) return;
    const renderer = viewerApi.renderer;
    const objectSelect = document.getElementById('objectSelect');
    if (!objectSelect) return;
    objectSelect.innerHTML = '';
    for (const objName in renderer.objectsData) {
        const option = document.createElement('option');
        option.value = objName;
        option.textContent = objName;
        objectSelect.appendChild(option);
    }
    if (renderer.currentObjectName) objectSelect.value = renderer.currentObjectName;
}

function updateFrameUI() {
    if (!viewerApi?.renderer) return;
    const renderer = viewerApi.renderer;
    const objName = renderer.currentObjectName;
    if (!objName) return;
    const numFrames = renderer.objectsData[objName]?.frames?.length || 1;
    const frameSlider = document.getElementById('frameSlider');
    if (frameSlider) {
        frameSlider.max = numFrames - 1;
        frameSlider.value = 0;
    }
    const frameCounter = document.getElementById('frameCounter');
    if (frameCounter) frameCounter.textContent = `1 / ${numFrames}`;
}

// ============================================================================
// DOWNLOAD FUNCTIONS - PDB & CSV with pBind values
// ============================================================================

function generatePDBWithPBind(uniprotId) {
    const originalPdb = pdbDataCache[uniprotId];
    if (!originalPdb) return null;

    const predictions = bindingSiteCache[uniprotId];
    if (!predictions || !predictions.scoreMap) {
        alert('Binding predictions not loaded. Please reload the protein.');
        return null;
    }

    const lines = originalPdb.split('\n');
    const modifiedLines = [];

    for (const line of lines) {
        // Only keep ATOM records (skip HETATM and TER)
        if (line.startsWith('ATOM')) {
            const chain = line.substring(21, 22).trim();
            const resiStr = line.substring(22, 26).trim();
            const resiNum = parseInt(resiStr, 10);

            if (isNaN(resiNum)) continue; // Skip invalid residue numbers

            const key = `${chain},${resiNum}`;

            // Only include atoms that have pBind predictions
            const pbindScore = predictions.scoreMap[key];
            if (pbindScore !== undefined) {
                // Replace B-factor column (columns 61-66) with pBind value (scaled 0-100)
                const bfactor = (pbindScore * 100).toFixed(2);
                const newLine = line.substring(0, 60) +
                               bfactor.padStart(6, ' ') +
                               line.substring(66);
                modifiedLines.push(newLine);
            }
            // Skip atoms without predictions
        } else if (line.startsWith('END')) {
            modifiedLines.push(line);
        }
    }

    return modifiedLines.join('\n');
}

function downloadPDB(uniprotId) {
    const pdbContent = generatePDBWithPBind(uniprotId);
    if (!pdbContent) return;

    const blob = new Blob([pdbContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${uniprotId}_AF2BIND.pdb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadCSV(uniprotId) {
    const predictions = bindingSiteCache[uniprotId];
    if (!predictions) {
        alert('No predictions available');
        return;
    }

    // Generate CSV with pBind data
    let csv = 'chain,residue_number,pbind\n';

    for (const key of Object.keys(predictions.scoreMap).sort()) {
        const [chain, resiNum] = key.split(',');
        const score = predictions.scoreMap[key];
        csv += `${chain},${resiNum},${score.toFixed(6)}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${uniprotId}_AF2BIND_predictions.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============================================================================
// COLOR HANDLING & BINDING SITE
// ============================================================================

async function loadBindingSitePredictions(uniprotId) {
    try {
        const lastTwoChars = uniprotId.slice(-2).toUpperCase();
        const url = `https://af2bind.solab.org/preds/${lastTwoChars}/${uniprotId}-F1-model_v4.csv`;

        const response = await fetch(url);
        if (!response.ok) {
            console.debug(`Binding predictions not available for ${uniprotId}`);
            return;
        }

        const csvText = await response.text();
        const scoreMap = parseBindingSiteCSV(csvText);
        if (scoreMap && Object.keys(scoreMap).length > 0) {
            bindingSiteCache[uniprotId] = { scoreMap, loaded: new Date().toISOString() };
            console.log(`✓ Loaded binding predictions for ${uniprotId}: ${Object.keys(scoreMap).length} residues`);
        }
    } catch (error) {
        console.warn('Failed to load binding predictions:', error.message);
    }
}

function parseBindingSiteCSV(csvText) {
    // CSV format: can be either:
    // - rank,chain,resi,resn,p(bind),arr_i (full format)
    // - chain,resi,p(bind) (simplified format)
    // Parse into map of (chain,resi) -> score for proper residue lookup
    const lines = csvText.trim().split('\n');
    const scoreMap = {}; // Map of "chain,resi" -> score

    // Detect format from header
    const header = lines[0];
    let chainIdx, resiIdx, scoreIdx;

    if (header.includes('rank')) {
        // Full format: rank,chain,resi,resn,p(bind),arr_i
        chainIdx = 1;
        resiIdx = 2;
        scoreIdx = 4;
    } else {
        // Simplified format: chain,resi,p(bind)
        chainIdx = 0;
        resiIdx = 1;
        scoreIdx = 2;
    }

    // Parse data lines (skip header at line 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const parts = line.split(',');
        if (parts.length > scoreIdx) {
            const chain = parts[chainIdx].trim().toUpperCase(); // Normalize chain to uppercase
            const resiStr = parts[resiIdx].trim();
            const resi = parseInt(resiStr, 10); // 1-based residue index
            const scoreStr = parts[scoreIdx].trim();
            const score = parseFloat(scoreStr); // p(bind) column

            if (!isNaN(resi) && !isNaN(score)) {
                const key = `${chain},${resi}`;
                scoreMap[key] = Math.max(0, Math.min(1, score));
            }
        }
    }
    return Object.keys(scoreMap).length > 0 ? scoreMap : null;
}

/**
 * Custom color function for "pbind" mode
 * Maps binding site scores to colors: red (0) → white (0.5) → blue (1.0)
 * @param {number} atomIndex - Index of the atom
 * @param {object} renderer - Reference to the renderer
 * @returns {object} Color as {r, g, b}
 */
function bindingSiteColorFunc(atomIndex, renderer) {
    const objName = renderer.currentObjectName;
    if (!objName) return { r: 128, g: 128, b: 128 };

    const predictions = bindingSiteCache[objName];
    if (!predictions || !predictions.scoreMap) {
        return { r: 128, g: 128, b: 128 }; // Grey for unmapped
    }

    // Look up chain and residue number from atomIndexMap
    const atomInfo = atomIndexMap[objName];
    if (!atomInfo || atomIndex >= atomInfo.length) {
        return { r: 128, g: 128, b: 128 }; // Grey if index out of range
    }

    const chain = atomInfo[atomIndex].chain;
    const resiNum = atomInfo[atomIndex].resiNum;

    if (resiNum === null || resiNum === undefined) {
        return { r: 128, g: 128, b: 128 }; // Grey for unmapped residue
    }

    const key = `${chain},${resiNum}`;
    const score = predictions.scoreMap[key]; // 0-1 range

    if (score === undefined || score === null) {
        return { r: 128, g: 128, b: 128 }; // Grey for residues without predictions
    }

    // Color gradient: white (0) → blue (1.0)
    const t = score; // 0-1 for entire range
    return {
        r: Math.round(255 * (1 - t)),
        g: Math.round(255 * (1 - t)),
        b: 255
    };
}

function handleColorChange() {
    if (!viewerApi?.renderer) return;
    const colorSelect = document.getElementById('colorSelect');
    let mode = colorSelect?.value;

    // Let the renderer handle all color modes (including custom "binding" mode)
    const renderer = viewerApi.renderer;
    renderer.colorMode = mode;
    renderer.colors = null;
    renderer.colorsNeedUpdate = true;
    renderer.plddtColorsNeedUpdate = true;
    renderer.render('af2bind: color changed');

    // Update sequence viewer colors to match
    if (window.SequenceViewer?.updateSequenceViewColors) {
        window.SequenceViewer.updateSequenceViewColors();
    }
}

function applyBindingSiteColoring() {
    if (!viewerApi?.renderer) return;
    const renderer = viewerApi.renderer;
    const objName = renderer.currentObjectName;
    if (!objName) return;

    const predictions = bindingSiteCache[objName];
    if (!predictions) {
        console.warn('No binding site predictions for', objName);
        renderer.colorMode = 'deepmind';
        renderer.colorsNeedUpdate = true;
        renderer.render('af2bind: binding fallback');
        return;
    }

    const scores = predictions.scores;
    const obj = renderer.objectsData[objName];
    if (!obj?.frames) return;

    for (let frameIdx = 0; frameIdx < obj.frames.length; frameIdx++) {
        const frame = obj.frames[frameIdx];
        if (!frame.coords) continue;
        frame.plddts = scores.slice(0, frame.coords.length).map(score => Math.round(score * 100));
    }

    renderer.colorMode = 'deepmind';
    renderer.colorsNeedUpdate = true;
    renderer.render('af2bind: binding colors');
    console.log(`✓ Applied binding site coloring for ${objName}`);
}

function handleObjectChange() {
    if (!viewerApi?.renderer) return;
    const objectSelect = document.getElementById('objectSelect');
    const objName = objectSelect?.value;
    if (objName) {
        viewerApi.renderer.currentObjectName = objName;
        viewerApi.renderer.render('af2bind: object changed');
        updateFrameUI();
        // Update sequence viewer for the new object
        if (window.SequenceViewer?.buildSequenceView) {
            window.SequenceViewer.buildSequenceView();
        }
        // Update binding results table for the new object
        renderBindingSiteResults(objName);
    }
}

function handleClearAll() {
    if (!viewerApi?.renderer) return;
    if (confirm('Clear all structures?')) {
        const renderer = viewerApi.renderer;
        renderer.objectsData = {};
        renderer.currentObjectName = null;
        renderer.render('af2bind: clear all');
        document.getElementById('viewer-container').style.display = 'none';
        document.getElementById('sequence-viewer-container').style.display = 'none';
        const sequenceView = document.getElementById('sequenceView');
        if (sequenceView) sequenceView.classList.add('hidden');
        updateObjectSelect();
        setStatus("Cleared all structures");
    }
}
