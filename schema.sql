

CREATE TABLE Config (
    INTEGER cid,
    INTEGER ceid,
    PRIMARY KEY (cid, ceid),
    FOREIGN KEY (ceid) REFERENCES ConfigElement
);

CREATE TABLE ConfigElement (
    INTEGER ceid PRIMARY KEY,
    TEXT name
);

CREATE TABLE Project (
    INTEGER pid,
    INTEGER cid
);

CREATE TABLE ProjectMetadata (
    INTEGER pmid PRIMARY KEY,
    INTEGER pid,
    TEXT key,
    TEXT value
);

