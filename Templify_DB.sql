CREATE TABLE plandepago (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50),
        fechainicio TIMESTAMP NOT NULL,
        fechafin TIMESTAMP NOT NULL,
        precio INT NOT NULL
    );


    CREATE TABLE usuario (
        id SERIAL PRIMARY KEY,
        empresa VARCHAR(50),   
        nombre VARCHAR(50) NOT NULL,
        mail VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        username VARCHAR(50) NOT NULL,
        telefono VARCHAR(50),
        plandepago INT,            
        CONSTRAINT fk_usuario_plandepago FOREIGN KEY (plandepago) REFERENCES plandepago(id)
    );
ALTER TABLE usuario ADD COLUMN fotoperfil VARCHAR(255);


    CREATE TABLE archivos (
        id SERIAL PRIMARY KEY,
        idusuario INT NOT NULL,     
        linkarchivo VARCHAR(1000) NOT NULL,
        nombrearchivo VARCHAR(50) NOT NULL,
        CONSTRAINT fk_archivos_usuario FOREIGN KEY (idusuario) REFERENCES usuario(id)
    );


    CREATE TABLE plantilla (
        id SERIAL PRIMARY KEY,
        linktemplate VARCHAR(1000) NOT NULL,
        nombre TEXT NOT NULL
    );



    CREATE TABLE planxus (
        id SERIAL PRIMARY KEY,
        idplantilla INT NOT NULL,    
        idusuario INT NOT NULL,      
        CONSTRAINT fk_planxus_plantilla FOREIGN KEY (idplantilla) REFERENCES plantilla(id),
        CONSTRAINT fk_planxus_usuario FOREIGN KEY (idusuario) REFERENCES usuario(id)
    );

INSERT INTO plantilla (linktemplate, nombre) VALUES ('https://noah2.s3.us-east-2.amazonaws.com/Base/momo.html', 'momo')
INSERT INTO plantilla (linktemplate, nombre) VALUES ('https://noah2.s3.us-east-2.amazonaws.com/Base/boom.html', 'bomba')

SELECT * FROM plantilla