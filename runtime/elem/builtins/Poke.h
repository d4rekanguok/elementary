#pragma once

#include "../GraphNode.h"


namespace elem
{

    template <typename FloatType>
    struct PokeNode : public GraphNode<FloatType> {
        using GraphNode<FloatType>::GraphNode;

        void poke() {
            flag.store(true);
        }

        void process (BlockContext<FloatType> const& ctx) override {
            auto* outputData = ctx.outputData[0];
            auto numSamples = ctx.numSamples;

            for (size_t i = 0; i < numSamples; ++i) {
                outputData[i] = FloatType(0);
            }

            if (flag.exchange(false) && numSamples > 0) {
                outputData[0] = FloatType(1);
            }
        }


        std::atomic<bool> flag;
    };

} // namespace elem
