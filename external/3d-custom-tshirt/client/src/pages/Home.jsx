import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import state from "../store";
import { CustomButton } from "../components";
import {
    headContainerAnimation,
    headContentAnimation,
    slideAnimation,
    headTextAnimation
} from "../config/motion"

const navigateTopWindow = (path) => {
    const targetWindow = window.top ?? window;
    targetWindow.location.href = path;
};

const Home = () => {
    const snap = useSnapshot(state);

    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.section className="home" {...slideAnimation("left")}>
                    <motion.div className="home-content" {...headContainerAnimation}>
                        <motion.div {...headTextAnimation}>
                            <h1 className="head-text max-w-[6ch]">
                                Pesan sekarang
                            </h1>
                        </motion.div>

                        <motion.div {...headContentAnimation} className="flex flex-col gap-5">
                            <p className="max-w-md text-base font-normal text-white/80">
                                Gunakan desain 3D ini sebagai rujukan visual sebelum lanjut ke halaman desain Bradwear.
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigateTopWindow("/")}
                                    className="rounded-full border border-white/12 bg-white/92 px-4 py-2.5 text-sm font-bold text-black transition hover:-translate-y-0.5"
                                >
                                    Beranda
                                </button>
                                <CustomButton
                                    type="filled"
                                    title="Halaman Desain"
                                    handleClick={() => navigateTopWindow("/katalog")}
                                    customStyles='w-fit px-4 py-2.5 font-bold text-sm'
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default Home;
