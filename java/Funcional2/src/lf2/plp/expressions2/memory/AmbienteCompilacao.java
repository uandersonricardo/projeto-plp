package lf2.plp.expressions2.memory;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import lf2.plp.expressions1.util.Tipo;


public interface AmbienteCompilacao extends Ambiente<Tipo> {

	default List<Map<String,String>> getPilhaSnapshot() {
		return Collections.emptyList();
	}

}
