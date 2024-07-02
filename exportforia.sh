#!/bin/bash

# Funzione per ottenere tutti i file ricorsivamente
get_all_files() {
    find "$1" -type f
}

# Funzione per esportare il codice sorgente
export_source_code() {
    src_dir="$1"
    output_file="$2"
    
    # Inizia l'array JSON
    echo "[" > "$output_file"
    
    first_file=true
    
    # Itera su tutti i file nella directory src
    while IFS= read -r -d '' file; do
        # Ottieni il percorso relativo del file
        relative_path="${file#$src_dir/}"
        
        # Leggi il contenuto del file
        content=$(cat "$file" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
        
        # Aggiungi una virgola se non è il primo file
        if [ "$first_file" = false ]; then
            echo "," >> "$output_file"
        fi
        first_file=false
        
        # Scrivi l'oggetto JSON per questo file
        echo "{" >> "$output_file"
        echo "  \"path\": \"$relative_path\"," >> "$output_file"
        echo "  \"content\": \"$content\"" >> "$output_file"
        echo -n "}" >> "$output_file"
    done < <(get_all_files "$src_dir" -print0)
    
    # Chiudi l'array JSON
    echo "" >> "$output_file"
    echo "]" >> "$output_file"
    
    echo "Source code exported to $output_file"
}

# Imposta le variabili per le directory
#script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src_dir="src"
output_file="sourceCode.json"

# Esegui la funzione di esportazione
export_source_code "$src_dir" "$output_file"
