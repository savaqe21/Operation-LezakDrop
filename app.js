document.addEventListener('DOMContentLoaded', function () {
  // Hashe flag (SHA-256)
  const FLAG1_HASH =
    'acecaa9fa3d3787c702a2a47d165f36fd12257988b3f31e739ae042b583f1d7e';
  const FLAG2_HASH =
    'a39f240eba24cc2c2a8262a7c66765882c89210e282e4aa706ff1fbe3857190d';

  // Terminal functionality for the Securitum Tactical Terminal
  const terminal = {
    output: document.getElementById('terminal-output'),
    input: document.getElementById('terminal-input'),
    cursor: document.getElementById('cursor'),
    prompt: 'securitum@tactical:~$ ',
    history: [],
    historyIndex: -1,
    commands: {
      help: showHelp,
      clear: clearTerminal,
      flag: checkFlag,
      status: showStatus,
      scan: scanTarget,
      recon: reconTarget,
      mission: showMission,
      agent: showAgent,
      exit: exitTerminal,
    },
    init: function () {
      this.input.addEventListener('keydown', this.handleInput.bind(this));
      this.input.focus();
      // Add click event to focus on terminal
      document
        .querySelector('.terminal-container')
        .addEventListener('click', () => {
          this.input.focus();
        });
      // Initial welcome message
      this.writeOutput(
        `
            █ SECURITUM TACTICAL TERMINAL v2.0<br>
            █ OPERACJA: LEZAKDROP<br>
            █ STATUS: POŁĄCZONO<br>
            <br>
            Witaj w terminalu taktycznym Securitum. Ten terminal służy do
            kontroli operacji związanych z przejęciem zasobu SECURITUM-LC-2025.
            <br>
            Wpisz 'help' aby uzyskać listę dostępnych komend.
            `,
        'command-output'
      );
    },
    handleInput: function (e) {
      // Handle Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = this.input.value.trim();
        this.executeCommand(command);
        this.input.value = '';
        // Add to history if not empty
        if (command) {
          this.history.push(command);
          this.historyIndex = this.history.length;
        }
      }
      // Handle Up Arrow for history
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      }
      // Handle Down Arrow for history
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
      // Handle Tab for autocomplete
      else if (e.key === 'Tab') {
        e.preventDefault();
        const partialCmd = this.input.value.trim();
        if (partialCmd) {
          const matches = Object.keys(this.commands).filter((cmd) =>
            cmd.startsWith(partialCmd)
          );
          if (matches.length === 1) {
            this.input.value = matches[0];
          } else if (matches.length > 1) {
            this.writeOutput(
              `
${this.prompt}${partialCmd}`,
              'command-input'
            );
            this.writeOutput(matches.join(' '), 'command-output');
          }
        }
      }
    },
    executeCommand: function (command) {
      // Write the command to the terminal
      this.writeOutput(
        `
${this.prompt}${command}`,
        'command-input'
      );
      // Parse the command
      const args = command.split(' ');
      const cmd = args[0].toLowerCase();
      // Execute the command if it exists
      if (cmd && this.commands[cmd]) {
        this.commands[cmd](args.slice(1), this);
      } else if (cmd) {
        this.writeOutput(
          `Nieznana komenda: ${cmd}. Wpisz 'help' aby uzyskać pomoc.`,
          'command-error'
        );
      }
      // Auto-scroll to the bottom
      this.output.scrollTop = this.output.scrollHeight;
    },
    writeOutput: function (text, className = '') {
      const output = document.createElement('div');
      output.className = className;
      output.innerHTML = text;
      this.output.appendChild(output);
      // Auto-scroll
      this.output.scrollTop = this.output.scrollHeight;
    },
    triggerSuccessFlash: function () {
      const body = document.getElementById('flash-overlay');
      body.style.animation = 'success-pulse 0.5s 3';
      setTimeout(() => {
        body.style.animation = '';
      }, 1500);
    },
  };

  // Initialize terminal
  terminal.init();

  // Focus on input when document is clicked
  document.addEventListener('click', () => {
    terminal.input.focus();
  });

  // Async hash function
  async function sha256(str) {
    const buffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str)
    );
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Command Functions
  function showHelp(args, terminal) {
    terminal.writeOutput(
      `
        DOSTĘPNE KOMENDY:<br>
        -----------------<br>
        help       - Wyświetl listę dostępnych komend<br>
        clear      - Wyczyść terminal<br>
        flag [kod] - Wprowadź kod flagi do weryfikacji<br>
        status     - Sprawdź status operacji<br>
        scan       - Przeprowadź skanowanie zasobu SECURITUM-LC-2025<br>
        recon      - Przeprowadź rekonesans zasobu<br>
        mission    - Wyświetl informacje o misji<br>
        agent      - Wyświetl dane agenta<br>
        exit       - Zamknij terminal
        `,
      'command-output'
    );
  }

  // Zakodowana flaga
  const encodedFlag =
    'TEVaQUtfQ1RGe01JU1NJT05fQUNDT01QTElTSEVEX0ZBQklBTl9XSU5TfQ==';

  // Deszyfracja
  const decodedFlag = atob(encodedFlag);

  function clearTerminal(args, terminal) {
    terminal.output.innerHTML = '';
  }

  async function checkFlag(args, terminal) {
    if (args.length === 0) {
      terminal.writeOutput(`UŻYCIE: flag [kod flagi]`, 'command-error');
      return;
    }

    const submittedFlag = args.join(' ');
    const flagHash = await sha256(submittedFlag);

    if (flagHash === FLAG1_HASH) {
      terminal.writeOutput(
        `
            █ AUTORYZACJA ZAKOŃCZONA SUKCESEM<br>
            █ FLAGA #1 POPRAWNA - PRZEJĘCIE ROZPOCZĘTE
            <br>
            GRATULACJE AGENCIE!
            <br>
            Udowodniłeś, że potrafisz patrzeć tam, gdzie większość nie zagląda – choć tym razem było łatwo.<br>
            To dopiero początek.
            <br>
            System zarejestrował anomalię wizualną…<br>
            Czy to tylko złudzenie? A może... coś mrugnęło w polu widzenia?
            <br>
            Zanim pójdziesz dalej, zerknij wyżej.<br>
            Czasem najciekawsze informacje lubią… tytułować się same.`,
        'command-success'
      );
      document.title = decodedFlag;
      terminal.triggerSuccessFlash();
    } else if (flagHash === FLAG2_HASH) {
      terminal.writeOutput(
        `
            █ AUTORYZACJA ZAKOŃCZONA SUKCESEM<br>
            █ FLAGA #2 ODNALEZIONA!...FINISH
            <br>
            "Nie każdy leżak wart jest zdobycia. Ale ten – właśnie został przejęty"
            <br>
            Operacja „Leżak” – zakończona sukcesem.
            <br>
            Dziękuję, że poświęciłeś czas na ten mały eksperyment.
            Mam nadzieję, że choć przez chwilę udało mi się umilić Ci wieczór, wywołać uśmiech albo chociaż lekkie podniesienie brwi.
            <br>
            Nie kłamałem, kiedy mówiłem, że zrobię wszystko.
            I choć exploitów nie użyłem (tym razem), to może udało mi się znaleźć podatność na… serwerze empatii.
            <br>
            Wszystko, co tu zobaczyłeś, powstało z czystej frajdy –
            jako humorystyczno-edukacyjny CTF dla siebie i jako kreatywny sposób pokazania, że pentester potrafi nie tylko łamać, ale też budować.
            <br>
            Jeśli dotarłeś aż tutaj, to znaczy, że choć jednej osobie leżakowy sen się spełnił.
            <br>
            Z pentesterskim pozdrowieniem (dla leżaka też)–
            Fabian (Savaqe21)
            <br>
            PS: Żadnych śrubek nie fuzzowałem. Naprawdę.
            `,
        'command-success'
      );
      document.title = 'Leżak chce być mój';
      terminal.triggerSuccessFlash();
    } else {
      terminal.writeOutput(
        `
            ║ BŁĄD AUTORYZACJI<br>
            ║ NIEPRAWIDŁOWY KOD FLAGI
            <br>
            Wskazówka: Poszukaj części flagi w źródle strony i w arkuszu stylów.`,
        'command-error'
      );
    }
  }

  function showStatus(args, terminal) {
    terminal.writeOutput(
      `
        ║ STATUS OPERACJI LEZAKDROP
        <br>
        - GOTOWOŚĆ MISJI: 100%<br>
        - STAN ZASOBU: AKTYWNY<br>
        - PRIORYTET: BARDZO WYSOKI<br>
        - LOKALIZACJA CELU: POTWIERDZONA<br>
        - GOTOWOŚĆ AGENTA: MAKSYMALNA<br>
        <br>
        Ocena ogólna: LEZAK GOTOWY DO PRZEJĘCIA
        `,
      'command-output'
    );
  }

  function scanTarget(args, terminal) {
    terminal.writeOutput(
      `Rozpoczynam skanowanie zasobu SECURITUM-LC-2025...`,
      'command-output'
    );
    // Simulate scanning with delayed outputs
    setTimeout(() => {
      terminal.writeOutput(
        `
            [SKAN] Port "Relaksacyjny" - OTWARTY<br>
            [SKAN] Port "Podpórka pod plecy" - OTWARTY<br>
            [SKAN] Port "Drink holder" - OTWARTY<br>
            [SKAN] Podatność: Brak oporu na przejęcie - WYKRYTA<br>
            `,
        'command-output'
      );
      setTimeout(() => {
        terminal.writeOutput(
          `
                ║ SKANOWANIE ZAKOŃCZONE
                <br>
                Wykryto 3 otwarte porty.<br>
                Wykryto 1 krytyczną podatność.
                <br>
                Wniosek: Zasób gotowy do przejęcia. Wprowadź kod flagi
                aby kontynuować operację.
                `,
          'command-success'
        );
      }, 1000);
    }, 1500);
  }

  function reconTarget(args, terminal) {
    terminal.writeOutput(
      `Rozpoczynam rekonesans zasobu SECURITUM-LC-2025...`,
      'command-output'
    );
    setTimeout(() => {
      terminal.writeOutput(
        `
            [RECON] Model: SECURITUM-LC-2025<br>
            [RECON] Typ: Leżak<br>
            [RECON] Producent: Securitum<br>
            [RECON] Rok produkcji: 2025<br>
            [RECON] Poziom zabezpieczeń: Minimalny<br>
            [RECON] Podatności: <br>
                * Nielimitowany chill<br>
                * Wsparcie kręgosłupa<br>
                * Port na kawę<br>
                * Podatność typu "Chce być mój"<br>
            `,
        'command-output'
      );
      setTimeout(() => {
        terminal.writeOutput(
          `
            ║ REKONESANS ZAKOŃCZONY
                <br>
                Ocena: Zero CVE, same MVP.
                `,
          'command-success'
        );
      }, 1000);
    }, 1000);
  }

  function showMission(args, terminal) {
    terminal.writeOutput(
      `
    ║ MISJA: OPERACJA LEZAKDROP
        <br>
        CEL MISJI: Przejęcie kontroli nad zasobem typu LEŻAK należącym do Securitum.
        <br>
        PLAN DZIAŁANIA:<br>
        1. Wysłanie emaila do zarządu Securitum<br>
        2. Argumentacja potrzeby przejęcia zasobu<br>
        3. Wprowadzenie kodu flagi<br>
        4. Fizyczne przejęcie zasobu
        <br>
        OBIETNICE PO PRZEJĘCIU:<br>
        - Dedykowany VLAN (Very Lazy Area Network)<br>
        - Certyfikat SSL (Secure Siedzenie Leżakowe)<br>
        - Brak RCE (Remote Chair Exploitation)<br>
        - Brak użycia w celach phishingowych
        <br>
        STATUS: W TRAKCIE
        `,
      'command-output'
    );
  }

  function showAgent(args, terminal) {
    terminal.writeOutput(
      `
    ║ PROFIL AGENTA OPERACYJNEGO
        <br>
        IMIĘ I NAZWISKO: Fabian Leśniak<br>
        PSEUDONIM: Savaqe21<br>
        KONTAKT: fabianlesniak@icloud.com
        <br>
        UMIEJĘTNOŚCI:<br>
        - Przekonywanie zarządu<br>
        - Teleportacja leżaków<br>
        - Wrzucenie leżaka do Shodana<br>
        - Full scan serwerów empatii<br>
        - Zdobywanie flag
        <br>
        MOTTO: "Dacie mi go – wygrywacie. Nie dacie – i tak znajdę sposób."
        `,
      'command-output'
    );
  }

  function exitTerminal(args, terminal) {
    terminal.writeOutput(
      `
        Zamykanie połączenia...
        <br>
        Terminal zostanie wyłączony za 3 sekundy.
        `,
      'command-output'
    );
    setTimeout(() => {
      terminal.writeOutput(`Connection terminated.`, 'command-error');
      setTimeout(() => {
        // Clear the terminal but leave a message
        terminal.output.innerHTML = '';
        terminal.writeOutput(
          `
                Terminal wyłączony. Odśwież stronę aby ponownie uruchomić.
                `,
          'command-error'
        );
        // Disable input
        terminal.input.disabled = true;
      }, 1000);
    }, 2000);
  }

  // Add keyframe animation for success flash
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes success-flash {
      0% { background-color: #000000; }
      50% { background-color: #003300; }
      100% { background-color: #000000; }
    }`;
  document.head.appendChild(style);
});
