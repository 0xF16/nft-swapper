const faq = [
	{
		question: "1. Dlaczego warto skorzystać z portalu NFT Swapper?",
		answer: ["Portal NFT Swapper jest miejscem, gdzie spotykają się właściciele dwóch różnych tokenów NFT (w ramach jednej kolekcji) i decydują się na wykonanie ich wymiany. Wymiana ta odbywa się bez pośredników, więc ani na chwilę nie tracisz kontroli nad swoimi tokenami. Z uwagi na fakt sporych kosztów transakcyjnych na platformie sprzedażowej https://opensea.io/, portal ten daje przewagę na zminimalizowania tych kosztów do minimum."]
	},
	{
		question: "2. 	Czy na tym portalu jest możliwość handlu tokenami NFT?",
		answer: ["Obecnie zadaniem portalu NFT Swapper jest wymiana poszczególnych NFT w ramach jednej kolekcji."]
 	},
	{
		question: "3. 	Czy wymiana NFT na portalu NFT Swapper jest bezpieczna?",
        answer: [
            "Mechanizm wymiany oparty jest o zestaw smart-contractów napisanych w Solidity, co powoduje, że każdy użytkownik może przejrzeć kod i samemu ocenić na ile ta wymiana jest bezpieczna - wszystko w duchu Web3 i crypto. Te konkretne rozwiązania zostały dobrane w taki sposób, aby zapewnić jak największy poziom bezpieczeństwa i wolność w wymianach. Jednocześnie sama strona internetowa nie potrzebuje komunikacji z żadnym serwerem czy innymi usługami, ani OpenSea, co czyni ją niezależną. Wystarczy przeglądarka i portfel do kryptowalut (wallet). ",
            "Jednocześnie chcemy zaznaczyć, że pomimo dołożenia wszelkich starań kwestii bezpieczeństwa, smart contract może zawierać błędy - jeśli zauważyłeś/zauważyłaś taki błąd daj nam znać!"
        ]
 	}, 
	{
		question: "4. 	Jaka jest zasada działania portalu NFT Swapper?",
		answer: [
            "Kiedy dwóch posiadaczy NFT z jednej kolekcji zdecyduje się na ich wymianę, wchodzą oni na portal NFT SWAPPER i podłączają swój portfel kryptowalut do witryny (strona dostaje jedynie wgląd w posiadane przez Ciebie tokeny). Cała wymiana składa się z 4 transakcji, z których każda musi zakończyć się sukcesem, aby nastąpiła wymiana, a mianowicie:",
            "A)	Użytkownik1 wybiera z listy „Select your NFT” swój token, który chce wymienić.",
            "B) Następnie z listy „Swap for” wybiera NFT, na który chce się zamienić.",
            "C) Naciska przycisk „Create an offer”(Transakcja 1).",
            "D)	Pojawi się okno portfela kryptowalut, w którym należy potwierdzić rozpoczęcie transakcji.",
            "E) W tym momencie generowana jest oferta. Zostaje również pobrana pierwsza opłata transakcyjna (0.01 ETH).",
            "F) Po zakończeniu pierwszej transakcji (dymek z informacją w prawym, dolnym rogu) zostaje utworzona oferta wymiany, którą musi zaakceptować każda ze stron.",
            "G)	Aby wymiana była możliwa, obaj użytkownicy muszą zezwolić temu kontraktowi na operowanie na ich NFT (standardowo, jak na OpenSea czy UniSwap). Każda ze stron musi teraz udzielić kontraktowi takiej zgody, klikając w buton „Approve”. Użytkownik1 może w między czasie odświeżać oferty, naciskając przycisk „Refresh offers”, natomiast Użytkownik2 musi wejść do NFT Swapper’a, zalogować się swoim portfelem kryptowalut i też nacisnąć „Approve”.",
            "H)	W momencie, kiedy obie strony wykonają akceptacje (Transakcja 2 i 3), Użytkownik2 lub Użytkownik1 naciska przycisk „Swap” i wykonuje się wymiana obu tokenów. Tutaj następuje pobrana druga opłata transakcyjna (0.01 ETH), dlatego też, najbardziej fair jest aby operację “swap” wykonał Użytkownik2 - wtedy finalne koszty transakcji ponoszone są równo przez obie strony (Transakcja 4).",
            "I) W tym momencie następuje wymiana i każda ze stron może ją po chwili potwierdzić na stronie https://etherscan.io lub platformie sprzedażowej https://opensea.io/."
        ]
	},
	{
		question: "5. 	Ile mam czasu na akceptację oferty?",
		answer: ["Czas przez który możemy dokonywać wymiany w ramach jednej oferty został ustawiony na 8 godzin. Po tym czasie oferta przestaje być aktywna i wszelkie opłaty transakcyjne poniesione do tej pory przepadają."]
 	},
	{
		question: "6. 	Jakie są opłaty transakcyjne?",
		answer: [
            "Z racji tego, że smart-kontrakt portalu NFT Swapper nie jest bezpośrednio podłączony do portalu sprzedażowego https://opensea.io/, to opłata transakcyjna została ustawiona jako stała kwota w wysokości 0,02 ETH - pobierana w dwóch częściach po 0,01 ETH w dwóch momentach transakcji:",
            "A)	Przy utworzeniu oferty wymiany NFT – akcja wykonywana przez Użytkownika1", 
            "B) Przy docelowej wymianie (naciśnięciu przycisku „Swap”) – akcja może zostać wykonana zarówno przez Użytkownika1 lub Użytkownika2 (preferowane, aby poniesione koszta transakcji, zostały podzielone na dwie równe części)."
        ]
 	},
	{
		question: "7. 	Czy można zrezygnować z istniejącej transakcji?",
		answer: [
			"Tak – w każdej chwili można anulować ofertę naciskając przycisk „Reject”, jednakże musi się to odbyć przed ostateczną wymianą, czyli przed naciśnięciem przycisku „Swap”. Należy zaznaczyć, że jest to również operacja na blockchainie, więc trzeba liczyć się z poniesieniem kosztów gasu, w związku z jej wykonaniem. My nie pobieramy w tym miejscu żadnych opłat",
			"WAŻNE: REZYGNACJA Z TRANSAKCJI NIE POWODUJE ZWROTU ŚRODKóW POBRANYCH PODCZAS TWORZENIA OFERTY"
		]

 	},
	{
		question: "8. 	Jaka jest przewaga portalu NFT Swapper nad innymi portalami do wymiany NFT?",
		answer: ["Cały portal opiera się na smart-kontrakcie (pełne WEB3) i obsługuje tokeny  w standardzie ERC721, co czyni go bardzo bezpiecznym i całkowicie zdecentralizowanym u swoich podstaw."]
	},
	{
		question: "9. 	Czy można NFT Swapper’a używać na innym urządzeniu niż komputer?",
		answer: ["Tak – aplikacja działa na urządzeniach mobilnych, tj, smartfonach, tabletach etc."]
	},
	{
		question: "10. 	Czy mogę odzyskać wydaną opłatę transakcyjną jeśli zrezygnuję ze stworzonej oferty?",
		answer: ["Niestety nie zwracamy pobranej opłaty transakcyjnej. Zalecamy tworzenie przemyślanych ofert :)"]
	},
	{
		question: "11. 	W jaki sposób mogę się skontaktować z twórcami?",
		answer: ["Kontakt możliwy jest poprzez email: kontakt@nftswapper.pl, lub poprzez grupę telegramową dostępną poprzez kliknięcie \"Support\" w lewym dolnym rogu"]
	},
];
export default faq;