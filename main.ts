import { Plugin } from 'obsidian';

const AR_LETTERS: Record<string, string> = {
	// Shadda
	Shadda: "\u{0651}",

	// Short vowels
	Sukoon: "\u{0652}",
	Damma: "\u{064F}",
	Fatha: "\u{064E}",
	Kasra: "\u{0650}",
	Dammatan: "\u{064C}",
	Fathatan: "\u{064B}",
	Kasratan: "\u{064D}",

	// Misc
	Placeholder: "\u{25CC}",
	SuperscriptAlef: "\u{670}",

	// Punctuation
	ArabicQuestionMark: "\u{61F}",
	LeftAngleQuotationMark: "\u{00AB}",
	RightAngleQuotationMark: "\u{00BB}",
	Period: '.',
	Colon: ':',
	QuotationMark: '"',
	ArabicComma: "\u{060C}",
	EmDash: '—',

	// Letters
	Hamza: "\u{0621}",
	AlefWithMadda: "\u{0622}",
	AlefWithHamzaAbove: "\u{0623}",
	WawWithHamza: "\u{0624}",
	AlefWithHamzaBelow: "\u{0625}",
	YehWithHamzaAbove: "\u{0626}",
	Alef: "\u{0627}",
	Beh: "\u{0628}",
	TehMarbuta: "\u{0629}",
	Teh: "\u{062A}",
	Theh: "\u{062B}",
	Jeem: "\u{062C}",
	Hah: "\u{062D}",
	Khah: "\u{062E}",
	Dal: "\u{062F}",
	Thal: "\u{0630}",
	Reh: "\u{0631}",
	Zain: "\u{0632}",
	Seen: "\u{0633}",
	Sheen: "\u{0634}",
	Sad: "\u{0635}",
	Dad: "\u{0636}",
	Tah: "\u{0637}",
	Zah: "\u{0638}",
	Ain: "\u{0639}",
	Ghain: "\u{063A}",
	Feh: "\u{0641}",
	Qaf: "\u{0642}",
	Kaf: "\u{0643}",
	Lam: "\u{0644}",
	Meem: "\u{0645}",
	Noon: "\u{0646}",
	Heh: "\u{0647}",
	Waw: "\u{0648}",
	AlefMaksura: "\u{0649}",
	Yeh: "\u{064A}",
	AlefWaslah: "\u{0671}",

	Tatweel: "\u{0640}",
}

const BUCKWALTER: Record<string, string> = {
	'A': AR_LETTERS.Alef,
	'|': AR_LETTERS.AlefWithMadda,
	'{': AR_LETTERS.AlefWaslah,
	'`': AR_LETTERS.SuperscriptAlef,
	'b': AR_LETTERS.Beh,
	'p': AR_LETTERS.TehMarbuta,
	't': AR_LETTERS.Teh,
	'v': AR_LETTERS.Theh,
	'j': AR_LETTERS.Jeem,
	'H': AR_LETTERS.Hah,
	'x': AR_LETTERS.Khah,
	'd': AR_LETTERS.Dal,
	'*': AR_LETTERS.Thal,
	'r': AR_LETTERS.Reh,
	'z': AR_LETTERS.Zain,
	's': AR_LETTERS.Seen,
	'$': AR_LETTERS.Sheen,
	'S': AR_LETTERS.Sad,
	'D': AR_LETTERS.Dad,
	'T': AR_LETTERS.Tah,
	'Z': AR_LETTERS.Zah,
	'E': AR_LETTERS.Ain,
	'g': AR_LETTERS.Ghain,
	'f': AR_LETTERS.Feh,
	'q': AR_LETTERS.Qaf,
	'k': AR_LETTERS.Kaf,
	'l': AR_LETTERS.Lam,
	'm': AR_LETTERS.Meem,
	'n': AR_LETTERS.Noon,
	'h': AR_LETTERS.Heh,
	'w': AR_LETTERS.Waw,
	'Y': AR_LETTERS.AlefMaksura,
	'y': AR_LETTERS.Yeh,
	'F': AR_LETTERS.Fathatan,
	'N': AR_LETTERS.Dammatan,
	'K': AR_LETTERS.Kasratan,
	'a': AR_LETTERS.Fatha,
	'u': AR_LETTERS.Damma,
	'i': AR_LETTERS.Kasra,
	'~': AR_LETTERS.Shadda,
	'o': AR_LETTERS.Sukoon,
	'\'': AR_LETTERS.Hamza,
	'>': AR_LETTERS.AlefWithHamzaAbove,
	'<': AR_LETTERS.AlefWithHamzaBelow,
	'}': AR_LETTERS.YehWithHamzaAbove,
	'&': AR_LETTERS.WawWithHamza,
	'_': AR_LETTERS.Tatweel,

	',': AR_LETTERS.ArabicComma,
}

export default class BuckwalterPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor((element, _context) => {
			const codes = element.findAll("code")
			const links = element.findAll("a.internal-link")

			for (let code of codes) {
				code.replaceWith(code.createSpan({
					text: this.buckwalterProccesser(code.innerText)
				}))
			}

			for (let link of links) {
				const textNodes = Array.from(link.childNodes).filter(x => x instanceof Text)
				textNodes.forEach(x => link.replaceChild(link.createSpan({
					text: this.buckwalterProccesser(x.textContent)
				}), x))
			}
		})
	}

	private buckwalterProccesser(str: string | null): string {
		if (str == null) {
			return ""
		}
		if (str.startsWith("b/")) {
			return this.toBuckwalter(str)
		} else {
			return str
		}
	}

	private toBuckwalter(str: string): string {
		str = str.substring(2)
		let res = ""
		for (let c of str) {
			res += BUCKWALTER[c] ?? c
		}
		return res
	}
}

