package com.veersetu.khandesh.entity;

/**
 * The four districts that make up the Khandesh region.
 * Approximate district-centre coordinates are stored here so the map
 * screen has a sensible default pin location even before a village-level
 * latitude/longitude is set on a soldier record.
 */
public enum District {
    DHULE("Dhule", 20.9042, 74.7749),
    JALGAON("Jalgaon", 21.0077, 75.5626),
    NANDURBAR("Nandurbar", 21.3700, 74.2400),
    NASHIK("Nashik", 19.9975, 73.7898);

    private final String displayName;
    private final double lat;
    private final double lng;

    District(String displayName, double lat, double lng) {
        this.displayName = displayName;
        this.lat = lat;
        this.lng = lng;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getLat() {
        return lat;
    }

    public double getLng() {
        return lng;
    }
}
