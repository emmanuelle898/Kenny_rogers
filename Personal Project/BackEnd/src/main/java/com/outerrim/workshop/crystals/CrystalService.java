package com.outerrim.workshop.crystals;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CrystalService {

    private final List<Crystal> crystals = List.of(
            new Crystal("violet", "Violet Crystal", "#ba00ff"),
            new Crystal("blue", "Blue Crystal", "#0018f9"),
            new Crystal("yellow", "Yellow crystal", "#ffe81f"),
            new Crystal("crimson", "Crimson crystal", "#990000"),
            new Crystal("orange", "Orange crystal", "#be5103"),
            new Crystal("green", "Green crystal", "#33ff33"),
            new Crystal("white", "White crystal", "#f4f8ff"),
            new Crystal("black", "Black crystal", "#000000")
    );

    public List<Crystal> getAllCrystals() {
        return crystals;
    }
}
