create table pg_citizen
(
	citizen_id serial not null
		constraint a1_citizen_pk
			primary key,
	risk_sum double precision default 0 not null,
	interactions integer default 0 not null
);

alter table pg_citizen owner to postgres;

create table pg_interactions
(
	citizen_a integer not null
		constraint a1_interactions_a1_citizen_id_fk
			references pg_citizen
				on update restrict on delete cascade,
	citizen_b integer not null
		constraint a1_interactions_a1_citizen_id_fk_2
			references pg_citizen
				on update restrict on delete cascade,
	datetime timestamp default CURRENT_TIMESTAMP not null,
	risk_delta double precision not null,
	constraint a1_interactions_pk
		primary key (citizen_a, citizen_b, datetime)
);

alter table pg_interactions owner to postgres;

create table pg_diagnoses
(
	citizen_id integer not null
		constraint pg_diagnoses_pk
			primary key
		constraint pg_diagnoses_pg_citizen_id_fk
			references pg_citizen
				on update restrict on delete cascade,
	diagnose double precision not null
);

alter table pg_diagnoses owner to postgres;

