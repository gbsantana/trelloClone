create table user_account(
  id bigserial primary key,
  name varchar(100),
  email varchar(100) unique not null,
  password varchar(100) not null,
  bio text,
  created_at timestamp not null default now(),
  updated_at timestamp,
  enabled   bool not null default true
);

create table board(
    id bigserial primary key,
    name varchar(100),
    description text,
    background varchar(255),
    starred boolean not null default false,
    closed boolean not null default false,
    hash varchar(100) not null unique,
    created_at timestamp not null default now(),
    updated_at timestamp,
    owner_id bigint not null references user_account (id)
);

create table label (
    id bigserial primary key,
    name varchar(100),
    color varchar(7),
    created_at timestamp not null default now(),
    updated_at timestamp,
    board_id bigint not null references board_id (id)
);

create table card_list (
    id bigserial primary key,
    name varchar(100),
    show_order int not null,
    archived boolean not null default false,
    created_at timestamp not null default now(),
    updated_at timestamp,
    board_id bigint not null references board_id (id)
);

create table card (
    id bigserial primary key,
    title varchar(100) not null,
    description text,
    start_date timestamp,
    due_date timestamp,
    show_order int not null,
    archived boolean not null default false,
    created_at timestamp not null default now(),
    updated_at timestamp,
    card_list_id bigint not null references card_list (id)
);

create table card_labels (
    card_id bigint not null references card (id),
    label_id bigint not null references label (id),
    primary key (card_id, label_id)
);