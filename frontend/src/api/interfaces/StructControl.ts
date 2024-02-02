/**
 * Interface of control instructions
 */
export interface Control {
    /**
     * Predefined control signals.
     */
    signal:
        | "generation-pending"
        | "generation-started"
        | "generation-done"
        | "generation-error";
}
