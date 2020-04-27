
state="aceh"

str = """
'{}': {
    name: '{}',
    geoDataFile: `${INDONESIA_MAPS_DIR}/{}-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: '{}',
  },
""".replace("{}", state)

print(str)