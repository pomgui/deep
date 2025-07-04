import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],       // Ponto de entrada
    format: ['cjs', 'esm'],       // Gera CommonJS e ES Modules
    dts: true,                    // Gera arquivos .d.ts
    clean: true,                  // Limpa a pasta dist antes de construir
    target: 'es2019',             // Nível de compatibilidade
    platform: 'node',             // Para bibliotecas Node.js
    minify: true,                // Minifica o código
    sourcemap: true,              // Gera mapas de origem
    esbuildOptions(options) {
        // Opções adicionais do esbuild
        options.drop = ['console']  // Remove console.log na produção
    },
})