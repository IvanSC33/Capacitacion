 
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador transaccional único de la marcación/fichada.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'IdMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del colaborador (FK al maestro de trabajadores).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del fotocheck de proximidad (si aplica).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'CodigoFotocheck'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que ocurrió físicamente el registro de la marca.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'FechaMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora de la marcación en formato militar HHMM.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'HoraMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo de evento: I = Ingreso, S = Salida.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'TipoMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID del dispositivo utilizado (1 = Portal Web).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'IdReloj'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Dirección IP de red desde la cual el usuario hizo clic en "Marcar".', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'IPAddress'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Coordenada geográfica Y.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'Latitud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Coordenada geográfica X.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'Longitud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Bandera que indica éxito (1) o fracaso (0) en la obtención del GPS del dispositivo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionProcesada', @level2type=N'COLUMN', @level2name=N'IndGeoLocalizacion'
GO