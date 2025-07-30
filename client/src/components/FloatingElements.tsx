import { motion } from "framer-motion";
import { Book, Palette, Gamepad2, VenetianMask, Feather, Wand2 } from "lucide-react";

const FloatingElements = () => {
  const elements = [
    { Icon: Book, className: "text-purple-400", delay: 0 },
    { Icon: Palette, className: "text-sky-400", delay: 2 },
    { Icon: Gamepad2, className: "text-pink-400", delay: 1 },
    { Icon: VenetianMask, className: "text-purple-300", delay: 3 },
    { Icon: Feather, className: "text-sky-300", delay: 1.5 },
    { Icon: Wand2, className: "text-pink-300", delay: 2.5 },
  ];

  const positions = [
    { top: "10%", left: "5%" },
    { top: "20%", right: "8%" },
    { bottom: "25%", left: "10%" },
    { top: "40%", left: "50%" },
    { bottom: "15%", right: "5%" },
    { top: "15%", right: "25%" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map(({ Icon, className, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${className} opacity-30`}
          style={positions[index]}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={32} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
