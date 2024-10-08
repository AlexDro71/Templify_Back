    CREATE TABLE templatemaster (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(20) NOT NULL,
        contrasena TEXT NOT NULL
    );


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


    CREATE TABLE archivos (
        id SERIAL PRIMARY KEY,
        idusuario INT NOT NULL,     
        linkarchivo VARCHAR(255) NOT NULL,
        CONSTRAINT fk_archivos_usuario FOREIGN KEY (idusuario) REFERENCES usuario(id)
    );


    CREATE TABLE plantilla (
        id SERIAL PRIMARY KEY,
        idtemplatemaster INT NOT NULL, 
        textos TEXT NOT NULL,
        colores TEXT NOT NULL,
        tipo TEXT NOT NULL,
        ancho INT NOT NULL,
        largo INT NOT NULL,
        nombre TEXT NOT NULL,
        CONSTRAINT fk_plantilla_templatemaster FOREIGN KEY (idtemplatemaster) REFERENCES templatemaster(id)
    );

    CREATE TABLE assetxplantilla (
        id SERIAL PRIMARY KEY,
        ancho INT NOT NULL,
        alto INT NOT NULL,
        fkplantilla INT NOT NULL,  
        CONSTRAINT fk_assetxplantilla_plantilla FOREIGN KEY (fkplantilla) REFERENCES plantilla(id)
    );


    CREATE TABLE planxus (
        id SERIAL PRIMARY KEY,
        idplantilla INT NOT NULL,    
        idusuario INT NOT NULL,      
        CONSTRAINT fk_planxus_plantilla FOREIGN KEY (idplantilla) REFERENCES plantilla(id),
        CONSTRAINT fk_planxus_usuario FOREIGN KEY (idusuario) REFERENCES usuario(id)
    );


    CREATE TABLE archivoXplanUs (
        idarchivo INT NOT NULL,     
        idplanxus INT NOT NULL,     
        idassetxplantilla INT NOT NULL, 
        CONSTRAINT fk_archivoXplanUs_archivos FOREIGN KEY (idarchivo) REFERENCES archivos(id),
        CONSTRAINT fk_archivoXplanUs_planxus FOREIGN KEY (idplanxus) REFERENCES planxus(id),
        CONSTRAINT fk_archivoXplanUs_assetxplantilla FOREIGN KEY (idassetxplantilla) REFERENCES assetxplantilla(id)
    );