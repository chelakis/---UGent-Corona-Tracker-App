create table beacon_codes
(
    id          serial not null
        constraint beacon_codes_pk
            primary key
        constraint beacon_codes_pg_citizen_citizen_id_fk
            references pg_citizen,
    beacon_code text   not null
);

alter table beacon_codes
    owner to postgres;

create unique index beacon_codes_beacon_code_uindex
    on beacon_codes (beacon_code);

create unique index beacon_codes_id_uindex
    on beacon_codes (id);

