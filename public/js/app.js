// Initialisiert eine neue Vue.js-Instanz
new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        currentTable: 'laender',
        laenderData: [], 
        unternehmenData: [], 
        sortKey: '', // Der aktuelle Sortierschlüssel
        sortOrder: 1 
    },
    created() {
        // Lädt die Daten aus einer JSON-Datei beim Erstellen der Instanz
        fetch('data/emissionsdaten.json')
            .then(response => response.json())
            .then(data => {
                // Setzt die Daten für die Tabellen
                this.laenderData = data.laender;
                this.unternehmenData = data.unternehmen;
            })
            .catch(error => console.error('Fehler beim Laden der Daten:', error));
    },
    computed: {
        // Berechnet und filtert die Daten für die 'laender'-Tabelle
        filteredLaenderData() {
            return this.laenderData.filter(item => 
                item.land.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                item.jahr.toString().includes(this.searchQuery)
            ).sort((a, b) => this.sortData(a, b));
        },
        // Berechnet und filtert die Daten für die 'unternehmen'-Tabelle
        filteredUnternehmenData() {
            return this.unternehmenData.filter(item => 
                item.unternehmen.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                item.rang.toString().includes(this.searchQuery)
            ).sort((a, b) => this.sortData(a, b));
        }
    },
    methods: {
        // Suchfunktion mit Eingabevalidierung
        search() {
            const forbiddenCharacters = /[<>!=]/g;
    
            // Entfernen der verbotenen Zeichen
            if (forbiddenCharacters.test(this.searchQuery)) {
                console.warn('Suchanfrage enthält verbotene Zeichen.');
                this.searchQuery = this.searchQuery.replace(forbiddenCharacters, ''); // Entfernen der verbotenen Zeichen
            }
    
            // Begrenzung der Länge
            if (this.searchQuery.length > 100) {
                console.warn('Suchanfrage ist zu lang.');
                this.searchQuery = this.searchQuery.slice(0, 100); // Begrenzen der Länge
            }
        },

        // Zeigt die angegebene Tabelle an (Laender oder Unternehmen)
        showTable(table) {
            this.currentTable = table;
        },
        
        // Setzt den Sortierschlüssel und -richtung
        sortTable(table, key) {
            if (this.sortKey === key) {
                this.sortOrder *= -1; // Wechsel der Sortierreihenfolge
            } else {
                this.sortKey = key;
                this.sortOrder = 1; // Standardmäßig aufsteigend sortieren
            }
        },
        
        // Vergleicht zwei Datensätze basierend auf dem Sortierschlüssel
        sortData(a, b) {
            if (!this.sortKey) return 0;
            let result = 0;
            if (a[this.sortKey] < b[this.sortKey]) result = -1;
            if (a[this.sortKey] > b[this.sortKey]) result = 1;
            return result * this.sortOrder;
        }
    }
});