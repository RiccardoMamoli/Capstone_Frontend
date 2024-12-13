import { motion } from "framer-motion";


const CanIBorrowMoving = () => {

    const duration = 0.25
    const stagger = 0.025

    const canIBorrow = ["C", "a", "n", " ", "I", " ", "B", "o", "r", "r", "o", "w", "?"]

    return (
        <>
            <div>
                <motion.div
                    initial="initial"
                    whileHover="hovered"
                    style={{ position: "relative", overflow: "hidden", lineHeight: "0.95" }}
                    className="logo-name">
                    <div>
                        {canIBorrow.map((l, i) => {
                            return <motion.span
                                style={{ fontSize: "30px", display: "inline-block"}}
                                key={i}
                                transition={{
                                    duration: duration,
                                    ease: "easeInOut",
                                    delay: stagger * i
                                }}
                                variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}>
                                {l === " " ? "\u00A0" : l}
                            </motion.span>
                        })}
                    </div>
                    <div style={{ position: "absolute", inset: 0 }}>
                        {canIBorrow.map((l, i) => {
                            return <motion.span
                                transition={{
                                    duration: duration,
                                    ease: "easeInOut",
                                    delay: stagger * i
                                }}
                                style={{ fontSize: "30px", display: "inline-block" }}
                                variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}>
                                {l === " " ? "\u00A0" : l}
                            </motion.span>
                        })}
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default CanIBorrowMoving;