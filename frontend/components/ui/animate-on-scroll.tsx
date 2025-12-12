"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

interface AnimateOnScrollProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  className?: string
}

export function AnimateOnScroll({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: AnimateOnScrollProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
      scale: direction === "fade" ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>
      {children}
    </motion.div>
  )
}

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerChildren({ children, className = "", staggerDelay = 0.1 }: StaggerChildrenProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
}

export function StaggerItem({ children, direction = "up" }: StaggerItemProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  }

  return <motion.div variants={variants}>{children}</motion.div>
}

