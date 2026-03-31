/**
 * Design Tokens - Animation Constants
 *
 * Centralized animation timing values for consistent motion design.
 */

export const ANIMATION = {
  /**
   * Base delay before starting staggered animations (ms)
   */
  BASE_DELAY: 80,

  /**
   * Time step between each element in staggered animations (ms)
   */
  STAGGER_STEP: 90,
} as const

/**
 * Calculate stagger delay for animations
 *
 * @param index - The index of the element in the sequence
 * @returns CSS delay value (e.g., "170ms")
 *
 * @example
 * ```tsx
 * <div style={{ animationDelay: getStaggerDelay(index) }}>
 *   Item {index}
 * </div>
 * ```
 */
export function getStaggerDelay(index: number): string {
  return `${index * ANIMATION.STAGGER_STEP + ANIMATION.BASE_DELAY}ms`
}
