/**
 * Interface of control instructions
 */
export interface Control {
    /**
     * Predefined control signals.
     */
    signal: "generation-done" | "generation-error";
}
