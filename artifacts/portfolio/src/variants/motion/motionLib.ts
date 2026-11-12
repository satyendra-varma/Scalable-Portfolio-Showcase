/**
 * The only parts of Motion (framer-motion) the room uses: a value and the spring that moves it.
 * Import this module with import(), never statically: it then becomes its own small chunk, loaded after first
 * paint, and the bundler leaves the rest of the library out. Importing 'framer-motion/dom' with import()
 * directly would pull in all of it.
 */
export { animate, motionValue, type MotionValue } from 'framer-motion/dom';
